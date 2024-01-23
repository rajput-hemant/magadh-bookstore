import { pgEnum, text, uuid } from "drizzle-orm/pg-core";

import { createTable } from "../table-creator";

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
