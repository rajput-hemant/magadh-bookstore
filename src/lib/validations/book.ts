import { z } from "zod";

export const newBookSchema = z.object({
	id: z.string().optional(),
	title: z
		.string({ required_error: "Title is required" })
		.min(1, { message: "Title is required" })
		.min(3, { message: "Title should be at least 3 characters long" })
		.max(100, { message: "Title should not exceed 100 characters" }),
	description: z
		.string({ required_error: "Description is required" })
		.min(1, { message: "Description is required" }),
	authors: z.array(z.string(), { required_error: "Author(s) is required" }),
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
	z.object({ id: z.string({ required_error: "Book ID is required" }) }),
);
