import { randomUUID } from "crypto";
import { zValidator } from "@hono/zod-validator";
import { hash } from "bcryptjs";
import { Hono } from "hono";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { registerSchema } from "@/lib/validations/auth";
import type { ServerResponse } from "@/types/server-response";

export const auth = new Hono();

auth.post(
	"/:path{(register|signup)}", // /register or /signup
	zValidator("json", registerSchema, async (result, c) => {
		if (result.success === false) {
			return c.json(
				{
					status: "ERROR",
					message: "❌ Invalid Request Body",
					error: result.error.issues.map((i) => `${i.path}: ${i.message}`),
				} satisfies ServerResponse,
				400,
			);
		}

		const { email, password, role } = result.data;

		const user = await db.query.users.findFirst({
			where: (u, { eq }) => eq(u.email, email),
		});

		if (user) {
			return c.json(
				{
					status: "ERROR",
					message: "❌ Email already exists",
					error: "email_already_exists",
				} satisfies ServerResponse,
				400,
			);
		}

		const hashedPassword = await hash(password, 10);
		const username = randomUUID();

		await db
			.insert(users)
			.values({ username, email, password: hashedPassword, role });

		return c.json({
			status: "SUCCESS",
			message: "✅ You have successfully registered",
			data: null,
		} satisfies ServerResponse);
	}),
);
