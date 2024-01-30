import { z } from "zod";

export const updateUserSchema = z.object({
	email: z.string().email({ message: "Invalid Email" }).optional(),
	name: z
		.string()
		.min(3, { message: "Name must be at least 3 characters long" })
		.max(20, { message: "Name must be at most 20 characters long" })
		.optional(),
	username: z
		.string()
		.min(3, { message: "Username must be at least 3 characters long" })
		.max(20, { message: "Username must be at most 20 characters long" })
		.regex(/^[a-zA-Z0-9_]*$/, {
			message: "Username must contain only letters, numbers, and underscores",
		})
		.optional(),
});

export const changeRoleSchema = z.object({
	id: z.string().uuid({ message: "Invalid ID" }).optional(),
	role: z.enum(["user", "author", "admin"], {
		invalid_type_error: "Invalid Role",
		required_error: "Role is required",
	}),
});

export const deleteUSerSchema = z.object({
	id: z
		.string({ required_error: "User ID is required" })
		.uuid({ message: "Invalid User ID" }),
});
