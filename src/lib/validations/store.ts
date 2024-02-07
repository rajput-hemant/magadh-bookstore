import { z } from "zod";

export const buyBookSchema = z.object({
	id: z
		.string({ required_error: "Book id is required" })
		.uuid({ message: "Please provide a valid book id" }),
	quantity: z
		.string({ required_error: "Quantity is required" })
		.pipe(z.number().int({ message: "Quantity must be a number" }))
		.default("1")
		.optional(),
});
