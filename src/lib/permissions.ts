import type { Role } from "./db/schema";

export const ALL_PERMISSIONS = [
	// User
	"list_user",
	"update_user",
	"delete_self",
	"delete_user",
	"change_role",
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
	user: [
		"purchase_book",
		"update_user",
		"delete_self",
		"change_role",
		"purchase_history",
	],
	author: [
		"update_user",
		"delete_self",
		"change_role",
		"create_book",
		"update_book",
		"delete_book",
		"sell_book",
		"purchase_history",
	],
	admin: [
		"list_user",
		"delete_self",
		"delete_user",
		"change_role",
		"delete_book",
	],
};
