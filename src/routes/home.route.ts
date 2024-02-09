import { Hono } from "hono";

import type { ServerResponse } from "@/types/server-response";

import { routes } from ".";

export const home = new Hono();

home.get("/", async (c) => {
	return c.json({
		status: "SUCCESS",
		message: "Welcome to Magadh Bookstore API!",
		data: routes,
	} satisfies ServerResponse);
});
