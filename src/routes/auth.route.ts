import { randomUUID } from "crypto";
import { zValidator } from "@hono/zod-validator";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { sign } from "hono/jwt";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { authSchema, resetPasswordSchema } from "@/lib/validations/auth";
import type { ServerResponse } from "@/types/server-response";
import { deleteCookie, setCookie } from "hono/cookie";

export const auth = new Hono();

/* -----------------------------------------------------------------------------------------------
 * Register/Signup Route
 * -----------------------------------------------------------------------------------------------*/

auth.post(
	"/:path{(register|signup)}",
	zValidator("json", authSchema, async (result, c) => {
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

/* -----------------------------------------------------------------------------------------------
 * Login/Signin Route
 * -----------------------------------------------------------------------------------------------*/

auth.post(
	"/:path{(login|signin)}", // /login or /signin
	zValidator("json", authSchema, async (result, c) => {
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
			where: (u, { eq, and }) => and(eq(u.email, email), eq(u.role, role)),
		});

		if (!user) {
			return c.json(
				{
					status: "ERROR",
					message:
						"❌ User not found, the email is not registered or the role is incorrect",
					error: "user_not_found",
				} satisfies ServerResponse,
				400,
			);
		}

		const isPasswordValid = await compare(password, user.password);

		if (!isPasswordValid) {
			return c.json(
				{
					status: "ERROR",
					message: "❌ Invalid password",
					error: "invalid_password",
				} satisfies ServerResponse,
				400,
			);
		}

		const token = await sign(
			{
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role,
			},
			env.JWT_SECRET,
		);

		setCookie(c, "token", token, {
			path: "*",
			secure: true,
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 15, // 15 days
		});

		return c.json({
			status: "SUCCESS",
			message: "✅ You have successfully logged in",
			data: { token, tokenType: "Bearer" },
		} satisfies ServerResponse);
	}),
);

/* -----------------------------------------------------------------------------------------------
 * Logout/Signout Route
 * -----------------------------------------------------------------------------------------------*/

auth.get("/:path{(logout|signout)}", async (c) => {
	deleteCookie(c, "token");

	// TODO: Add a blacklist for the token (Optional)

	return c.json({
		status: "SUCCESS",
		message: "✅ You have successfully logged out",
		data: null,
	} satisfies ServerResponse);
});

/* -----------------------------------------------------------------------------------------------
 * Reset Password Route
 * -----------------------------------------------------------------------------------------------*/

auth.post(
	"/reset-password",
	zValidator("json", resetPasswordSchema, async (result, c) => {
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

		const { email, password, newPassword } = result.data;

		const user = await db.query.users.findFirst({
			where: (u, { eq }) => eq(u.email, email),
		});

		if (!user) {
			return c.json(
				{
					status: "ERROR",
					message: "❌ User not found, the email is not registered",
					error: "user_not_found",
				} satisfies ServerResponse,
				400,
			);
		}

		const isPasswordValid = await compare(password, user.password);

		if (!isPasswordValid) {
			return c.json(
				{
					status: "ERROR",
					message: "❌ Invalid password",
					error: "invalid_password",
				} satisfies ServerResponse,
				400,
			);
		}

		const hashedPassword = await hash(newPassword, 10);

		await db
			.update(users)
			.set({ password: hashedPassword })
			.where(eq(users.id, user.id));

		return c.json({
			status: "SUCCESS",
			message: "✅ You have successfully reset your password",
			data: null,
		} satisfies ServerResponse);
	}),
);

/* -----------------------------------------------------------------------------------------------
 * Forgot Password Route
 * -----------------------------------------------------------------------------------------------*/

// TODO: Implement forgot password route
