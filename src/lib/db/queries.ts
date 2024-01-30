/* -----------------------------------------------------------------------------------------------
 * book queries
 * -----------------------------------------------------------------------------------------------*/

import postgres from "postgres";
import { eq } from "drizzle-orm";
import type { z } from "zod";

import { db } from ".";
import { CustomError } from "../utils";
import { type NewBook, books, users } from "./schema";
import type { listBookSchema } from "../validations/book";
import type { changeRoleSchema, updateUserSchema } from "../validations/user";

/* -----------------------------------------------------------------------------------------------
 * user queries
 * -----------------------------------------------------------------------------------------------*/

export async function updateUser(
	id: string,
	payload: z.infer<typeof updateUserSchema>,
) {
	try {
		await db.update(users).set(payload).where(eq(users.id, id));
	} catch (error) {
		if (error instanceof postgres.PostgresError) {
			throw new CustomError(error.detail, "update_user_error");
		}

		throw new CustomError("Error updating user", "update_user_error");
	}
}

export async function changeRole(
	id: string,
	payload: z.infer<typeof changeRoleSchema>,
) {
	try {
		await db.update(users).set(payload).where(eq(users.id, id));
	} catch (error) {
		if (error instanceof postgres.PostgresError) {
			throw new CustomError(error.detail, "change_role_error");
		}

		throw new CustomError("Error changing role", "change_role_error");
	}
}

export async function deleteUser(id: string) {
	try {
		const deletedUser = await db
			.delete(users)
			.where(eq(users.id, id))
			.returning();

		return deletedUser;
	} catch (error) {
		if (error instanceof postgres.PostgresError) {
			throw new CustomError(error.detail, "delete_user_error");
		}

		throw new CustomError("Error deleting user", "delete_user_error");
	}
}

/* -----------------------------------------------------------------------------------------------
 * book queries
 * -----------------------------------------------------------------------------------------------*/

export async function listBooks(params: z.infer<typeof listBookSchema>) {
	const { title, authors, priceRange, sellCount, limit, page, sort } = params;

	const [minPrice, maxPrice] = priceRange
		? priceRange.split(",")
		: ["100", "1000"];

	try {
		const books = await db.query.books.findMany({
			limit,
			offset: (page - 1) * limit,
			where: (fields, { eq, and, gte, between }) => {
				return and(
					title ? eq(fields.title, title) : undefined,
					authors ? eq(fields.authors, authors) : undefined,
					sellCount ? gte(fields.sellCount, sellCount) : undefined,
					priceRange ? between(fields.price, minPrice, maxPrice) : undefined,
				);
			},
			orderBy: ({ title }, operators) => operators[sort](title),
		});

		return books;
	} catch (error) {
		if (error instanceof postgres.PostgresError) {
			throw new CustomError(error.detail, "list_books_error");
		}

		throw new CustomError("Error fetching books", "list_books_error");
	}
}

export async function createBook(newBook: NewBook) {
	try {
		const [book] = await db.insert(books).values(newBook).returning();

		return book;
	} catch (error) {
		if (error instanceof postgres.PostgresError) {
			throw new CustomError(error.detail, "create_book_error");
		}

		throw new CustomError("Error creating book", "create_book_error");
	}
}

export async function updateBook(book: NewBook) {
	try {
		const [updatedBook] = await db
			.update(books)
			.set(book)
			.where(eq(books.id, book.id!))
			.returning();

		return updatedBook;
	} catch (error) {
		if (error instanceof postgres.PostgresError) {
			throw new CustomError(error.detail, "update_book_error");
		}

		throw new CustomError("Error updating book", "update_book_error");
	}
}

export async function deleteBook(id: string) {
	try {
		const [deletedBook] = await db
			.delete(books)
			.where(eq(books.id, id))
			.returning();

		return deletedBook;
	} catch (error) {
		console.log(error);

		if (error instanceof postgres.PostgresError) {
			throw new CustomError(error.detail, "delete_book_error");
		}

		throw new CustomError("Error deleting book", "delete_book_error");
	}
}
