import {
	date,
	decimal,
	integer,
	pgEnum,
	text,
	uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { createTable } from "./table-creator";

/* -----------------------------------------------------------------------------------------------
 * Users Table
 * -----------------------------------------------------------------------------------------------*/

export const userRole = pgEnum("role", ["admin", "user", "author"]);

export const users = createTable("user", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name"),
	email: text("email").notNull().unique(),
	username: text("username").unique(),
	password: text("password").notNull(),
	role: userRole("role").default("user").notNull(),
});

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Role = (typeof userRole.enumValues)[number];

/* -----------------------------------------------------------------------------------------------
 * Books Table
 * -----------------------------------------------------------------------------------------------*/

export const books = createTable("book", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull().unique(),
	description: text("description").notNull(),
	authors: text("authors").array().notNull(),
	sellCount: integer("sell_count").notNull().default(0),
	price: decimal("price").notNull(), // TODO: add check constraint for 100 <= price <= 1000
});

export type NewBook = typeof books.$inferInsert;
export type Book = typeof books.$inferSelect;

/* -----------------------------------------------------------------------------------------------
 * Authors Table
 * -----------------------------------------------------------------------------------------------*/

export const authors = createTable("author", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	totalRevenue: decimal("total_revenue").notNull(),
});

/* -----------------------------------------------------------------------------------------------
 * Purchases Table
 * -----------------------------------------------------------------------------------------------*/

export const purchase_history = createTable("purchase_history", {
	userId: uuid("user_id")
		.primaryKey()
		.notNull()
		.references(() => users.id),
	bookId: uuid("book_id")
		.unique()
		.notNull()
		.references(() => books.id),
	purchaseDate: date("purchase_date").notNull(),
	price: decimal("price").notNull(),
	quantity: integer("quantity").notNull(),
});

export type NewPurchase = typeof purchase_history.$inferInsert;
export type Purchase = typeof purchase_history.$inferSelect;
