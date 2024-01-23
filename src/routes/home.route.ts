import { Hono } from "hono";

export const home = new Hono();

home.get("/", async (c) => {
	return c.text("Welcome to Magadh Bookstore API!");
});
