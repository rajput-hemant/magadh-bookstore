import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import type { JwtPayload } from "@/types";
import type { ServerResponse } from "@/types/server-response";
import { buyBookSchema } from "@/lib/validations/store";
import { authMiddleware, rbacMiddleware } from "@/lib/middleware";
import { buyBook, updatePurchaseHistory } from "@/lib/db/queries";

export const store = new Hono();

/* -----------------------------------------------------------------------------------------------
 * middlewares
 * -----------------------------------------------------------------------------------------------*/

store.use("*", authMiddleware());

/* -----------------------------------------------------------------------------------------------
 * routes
 * -----------------------------------------------------------------------------------------------*/

store.get(
	"/:path{(buy|purchase)}",
	rbacMiddleware("purchase_book"),
	zValidator("query", buyBookSchema, async (result, c) => {
		if (!result.success) {
			return c.json(
				{
					status: "ERROR",
					message: "❌ Invalid Request Body",
					error: result.error.issues.map((i) => `${i.path}: ${i.message}`),
				} satisfies ServerResponse,
				400,
			);
		}

		const { id, quantity } = result.data;
		const { id: userId } = c.get("jwtPayload") as JwtPayload;

		const purchasedBook = await buyBook(id, quantity);

		const purchaseHistory = await updatePurchaseHistory({
			bookId: id,
			userId,
			price: purchasedBook.price,
			purchaseDate: new Date().toISOString(),
			quantity: purchasedBook.sellCount,
		});

		return c.json({
			status: "SUCCESS",
			message: "✅ Successfully purchased book",
			data: { purchasedBook, purchaseHistory },
		} satisfies ServerResponse);
	}),
);
