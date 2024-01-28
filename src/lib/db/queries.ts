/* -----------------------------------------------------------------------------------------------
 * book queries
 * -----------------------------------------------------------------------------------------------*/

import postgres from "postgres";
import { db } from ".";
import { CustomError } from "../utils";
import { type NewBook, books } from "./schema";
import { eq } from "drizzle-orm";

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
