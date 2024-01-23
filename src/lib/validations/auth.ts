import { z } from "zod";

export const registerSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.regex(/^(?!\s*$).+/, "Password must not contain Whitespaces.")
		.regex(
			/^(?=.*[A-Z])/,
			"Password must contain at least one uppercase letter.",
		)
		.regex(
			/^(?=.*[a-z])/,
			"Password must contain at least one lowercase letter.",
		)
		.regex(/^(?=.*\d)/, "Password must contain at least one number.")
		.regex(
			/^(?=.*[~`!@#$%^&*()--+={}[\]|\\:;"'<>,.?/_₹])/,
			"Password must contain at least one special character.",
		)
		.min(8, "Password must be at least 8 characters long."),
	role: z
		.enum(["admin", "user", "author"], {
			invalid_type_error: "Role must be either `admin`, `user` or `author`",
		})
		.default("user"),
});
