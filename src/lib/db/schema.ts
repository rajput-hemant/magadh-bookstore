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
	price: decimal("price")
		.notNull()
		// NOTE: this is a workaround, drizzle-orm does not support check constraints yet
		// see: https://github.com/drizzle-team/drizzle-orm/issues/880#issuecomment-1814869720
		.default(sql`100 check (price >= 100 and price <= 1000)`),
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
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	bookId: uuid("book_id")
		.notNull()
		.references(() => books.id),
	purchaseDate: date("purchase_date").notNull(),
	price: decimal("price").notNull(),
	quantity: integer("quantity").notNull(),
});
