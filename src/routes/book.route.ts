import { createBook, updateBook } from "@/lib/db/queries";
import { authMiddleware, rbacMiddleware } from "@/lib/middleware";
import { newBookSchema, updateBookSchema } from "@/lib/validations/book";
import type { ServerResponse } from "@/types/server-response";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const book = new Hono();

/* -----------------------------------------------------------------------------------------------
 * middleware
 * -----------------------------------------------------------------------------------------------*/

book.use("*", authMiddleware());

/* -----------------------------------------------------------------------------------------------
 * routes
 * -----------------------------------------------------------------------------------------------*/

book.post(
	"/create",
	rbacMiddleware("create_book"),
	zValidator("json", newBookSchema, async (result, c) => {
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

		const book = await createBook(result.data);

		return c.json(
			{
				status: "SUCCESS",
				message: "✅ Book created successfully",
				data: book,
			} satisfies ServerResponse,
			201,
		);
	}),
);

book.post(
	"/update",
	rbacMiddleware("update_book"),
	zValidator("json", updateBookSchema, async (result, c) => {
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

		const book = await updateBook(result.data);

		return c.json(
			{
				status: "SUCCESS",
				message: "✅ Book updated successfully",
				data: book,
			} satisfies ServerResponse,
			200,
		);
	}),
);
