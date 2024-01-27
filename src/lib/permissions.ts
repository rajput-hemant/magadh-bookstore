import type { Role } from "./db/schema";

export const ALL_PERMISSIONS = [
	// User
	"delete_user",
	"purchase_history",

	// Book
	"create_book",
	"purchase_book",
	"sell_book",
	"update_book",
	"delete_book",
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];
type Permissions = Record<Role, Permission[]>;

export const permissions: Permissions = {
	user: ["purchase_book", "purchase_book", "delete_user", "purchase_history"],
	author: [
		"create_book",
		"update_book",
		"delete_book",
		"sell_book",
		"purchase_history",
	],
	admin: ["delete_user", "delete_book"],
};
