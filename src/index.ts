import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { HTTPException } from "hono/http-exception";

import "./lib/env"; // This is validation for the environment variables early

import { auth, user, book, home, ping, store, routes } from "./routes";
import type { ServerResponse } from "./types/server-response";

const app = new Hono({ strict: false }); // match routes w/ or w/o trailing slash

/* -----------------------------------------------------------------------------------------------
 * Middlewares
 * -----------------------------------------------------------------------------------------------*/

app.use("*", cors(), prettyJSON(), logger());

/* -----------------------------------------------------------------------------------------------
 * Routes
 * -----------------------------------------------------------------------------------------------*/

app.route("/", home);
app.route("/auth", auth);
app.route("/user", user);
app.route("/book", book);
app.route("/store", store);
app.route("/ping", ping);

/* 404 */
app.notFound((c) => {
	return c.json(
		{
			status: "FAILED",
			message: "🚫 Requested route not found, please enter a valid route",
			error: {
				code: "invalid_route",
				routes,
			},
		} satisfies ServerResponse,
		404,
	);
});

/* -----------------------------------------------------------------------------------------------
 * Global Error Handler
 * -----------------------------------------------------------------------------------------------*/
app.onError((err, c) => {
	if (err instanceof HTTPException) {
		return c.json(
			{
				status: "ERROR",
				error: "unauthorized",
				message:
					"❌ You are not authorized to access this resource, please provide a valid token",
			} satisfies ServerResponse,
			err.status,
		);
	}

	console.error(err);

	return c.json(
		{
			status: "ERROR",
			message: `❌ ${err.message}`,
			error: err.name,
		} satisfies ServerResponse,
		400,
	);
});

showRoutes(app, { colorize: true });

export default app;
