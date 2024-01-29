/* -----------------------------------------------------------------------------------------------
 * book queries
 * -----------------------------------------------------------------------------------------------*/

import postgres from "postgres";
import { eq } from "drizzle-orm";
import type { z } from "zod";

import { db } from ".";
import { CustomError } from "../utils";
import { type NewBook, books } from "./schema";
import type { listBookSchema } from "../validations/book";

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
