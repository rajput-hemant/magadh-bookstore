import {
	createBook,
	deleteBook,
	listBooks,
	updateBook,
} from "@/lib/db/queries";
import { authMiddleware, rbacMiddleware } from "@/lib/middleware";
import { CustomError } from "@/lib/utils";
import {
	deleteBookSchema,
	listBookSchema,
	newBookSchema,
	updateBookSchema,
} from "@/lib/validations/book";
import type { ServerResponse } from "@/types/server-response";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const book = new Hono();

/* -----------------------------------------------------------------------------------------------
 * middleware
 * -----------------------------------------------------------------------------------------------*/

book.use("/:path{^(?!list).*$}", authMiddleware());

/* -----------------------------------------------------------------------------------------------
 * routes
 * -----------------------------------------------------------------------------------------------*/

book.get(
	"/list",
	zValidator("query", listBookSchema, async (result, c) => {
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

		const { title, authors, priceRange, sellCount, limit, page, sort } =
			result.data;

		const books = await listBooks({
			title,
			authors,
			priceRange,
			sellCount,
			limit,
			page,
			sort,
		});

		return c.json(
			{
				status: "SUCCESS",
				message: "✅ Books fetched successfully",
				data: books,
			} satisfies ServerResponse,
			200,
		);
	}),
);

book.post(
	"/create",
	rbacMiddleware("create_book"),
	zValidator("json", newBookSchema, async (result, c) => {
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

book.get(
	"/delete/:id",
	rbacMiddleware("delete_book"),
	zValidator("param", deleteBookSchema, async (result, c) => {
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

		const deletedBook = await deleteBook(result.data.id);

		if (!deletedBook) {
			throw new CustomError(
				"Book not found, please check the book ID",
				"delete_book_error",
			);
		}

		return c.json(
			{
				status: "SUCCESS",
				message: "✅ Book deleted successfully",
				data: null,
			} satisfies ServerResponse,
			200,
		);
	}),
);
