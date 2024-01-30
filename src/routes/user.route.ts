import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authMiddleware, rbacMiddleware } from "@/lib/middleware";
import { db } from "@/lib/db";
import type { ServerResponse } from "@/types/server-response";
import {
	changeRoleSchema,
	deleteUSerSchema,
	updateUserSchema,
} from "@/lib/validations/user";
import { changeRole, deleteUser, updateUser } from "@/lib/db/queries";
import { CustomError } from "@/lib/utils";

export const user = new Hono();

/* -----------------------------------------------------------------------------------------------
 * middleware
 * -----------------------------------------------------------------------------------------------*/

user.use("*", authMiddleware());

/* -----------------------------------------------------------------------------------------------
 * routes
 * -----------------------------------------------------------------------------------------------*/

user.get("/list", rbacMiddleware("list_user"), async (c) => {
	const users = await db.query.users.findMany({
		columns: { password: false },
	});

	return c.json({
		status: "SUCCESS",
		message: "✅ Successfully fetched users",
		data: users,
	} satisfies ServerResponse);
});

user.post(
	"/update",
	rbacMiddleware("update_user"),
	zValidator("json", updateUserSchema, async (result, c) => {
		if (!result.success) {
			return c.json(
				{
					status: "ERROR",
					message: "❌ Invalid Query Parameters",
					error: result.error.issues.map((i) => `${i.path}: ${i.message}`),
				} satisfies ServerResponse,
				400,
			);
		}

		const { id } = c.get("jwtPayload");

		await updateUser(id, result.data);

		return c.json({
			status: "SUCCESS",
			message: "✅ Successfully updated user",
			data: null,
		} satisfies ServerResponse);
	}),
);

user.post(
	"/change-role",
	rbacMiddleware("change_role"),
	zValidator("json", changeRoleSchema, async (result, c) => {
		if (!result.success) {
			return c.json(
				{
					status: "ERROR",
					message: "❌ Invalid Query Parameters",
					error: result.error.issues.map((i) => `${i.path}: ${i.message}`),
				} satisfies ServerResponse,
				400,
			);
		}

		const { id, role } = c.get("jwtPayload");

		const payload = result.data;

		if (role === "admin" && payload.role !== "admin") {
			return c.json(
				{
					status: "ERROR",
					message: "❌ Only admins can change roles to admin",
					error: "forbidden",
				} satisfies ServerResponse,
				403,
			);
		}

		if (role === "admin" && payload.id) {
			await changeRole(payload.id, payload);
		} else {
			await changeRole(id, payload);
		}

		return c.json({
			status: "SUCCESS",
			message: "✅ Successfully updated user role",
			data: null,
		} satisfies ServerResponse);
	}),
);

user.get(
	"/delete/:id",
	rbacMiddleware("delete_user"),
	zValidator("param", deleteUSerSchema, async (result, c) => {
		if (!result.success) {
			return c.json(
				{
					status: "ERROR",
					message: "❌ Invalid Request Body",
					error: result.error.issues.map((i) => `${i.path}: ${i.message}`),
				} satisfies ServerResponse,
				400,
			);
		}

		const deletedUser = await deleteUser(result.data.id);

		if (!deletedUser) {
			throw new CustomError(
				"User not found, please check the User ID",
				"delete_User_error",
			);
		}

		return c.json(
			{
				status: "SUCCESS",
				message: "✅ User deleted successfully",
				data: null,
			} satisfies ServerResponse,
			200,
		);
	}),
);
