import type { Role } from "@/lib/db/schema";

// TODO: unable to augment the jwtPayload type, it is still typed as any

declare module "hono" {
	interface ContextVariableMap {
		jwtPayload: {
			id: string;
			email: string;
			username: string;
			role: Role;
		};
	}
}
