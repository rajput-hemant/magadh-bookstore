import { z } from "zod";

export const listBookSchema = z.object({
	title: z.string().optional(),
	authors: z
		.array(z.string().uuid({ message: "Invalid Author ID" }))
		.optional(),
	priceRange: z
		.string()
		.regex(/^\d+,\d+$/, "Price range should be in format: <min>,<max>")
		.optional(),
	sellCount: z.string().pipe(z.coerce.number()).optional(),
	page: z.string().pipe(z.coerce.number()).default("1"),
	limit: z.string().pipe(z.coerce.number().min(5).max(100)).default("10"),
	sort: z.enum(["asc", "desc"]).default("asc"),
	// TODO: add more filters
});

export const newBookSchema = z.object({
	id: z.string().uuid({ message: "Invalid Book ID" }).optional(),
	title: z
		.string({ required_error: "Title is required" })
		.min(1, { message: "Title is required" })
		.min(3, { message: "Title should be at least 3 characters long" })
		.max(100, { message: "Title should not exceed 100 characters" }),
	description: z
		.string({ required_error: "Description is required" })
		.min(1, { message: "Description is required" }),
	authors: z.array(z.string().uuid({ message: "Invalid Author ID" }), {
		required_error: "Author(s) is required",
	}),
	price: z.string({ required_error: "Price is required" }).refine(
		(price) => {
			const p = parseFloat(price);
			return p >= 100 && p <= 1000;
		},
		{ message: "Price should be between 100 and 1000" },
	),
});

export const updateBookSchema = z.intersection(
	newBookSchema.omit({ id: true }),
	z.object({
		id: z
			.string({ required_error: "Book ID is required" })
			.uuid({ message: "Invalid Book ID" }),
	}),
);

export const deleteBookSchema = z.object({
	id: z
		.string({ required_error: "Book ID is required" })
		.uuid({ message: "Invalid Book ID" }),
});
