import type { MiddlewareHandler } from "hono";
import { jwt } from "hono/jwt";

import type { JwtPayload } from "@/types";
import { env } from "./env";
import { type Permission, permissions as allPermissions } from "./permissions";

/* -----------------------------------------------------------------------------------------------
 * Auth Middleware
 * -----------------------------------------------------------------------------------------------*/

export function authMiddleware(): MiddlewareHandler {
	return async (c, next) => {
		const jwtMiddleware = jwt({ secret: env.JWT_SECRET });

		return jwtMiddleware(c, next);
	};
}

/* -----------------------------------------------------------------------------------------------
 * Role Based Access Control Middleware
 * -----------------------------------------------------------------------------------------------*/

export function rbacMiddleware(
	...permissions: Permission[]
): MiddlewareHandler {
	return async (c, next) => {
		const { role } = c.get("jwtPayload") as JwtPayload;

		if (permissions.some((p) => !allPermissions[role].includes(p))) {
			return c.json(
				{
					status: "ERROR",
					message: "❌ You are not authorized to access this resource",
					error: "unauthorized",
				},
				403,
			);
		}

		await next();
	};
}
