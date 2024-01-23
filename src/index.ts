import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import "./lib/env"; // This is validation for the environment variables early

import { home } from "./routes";
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

/* 404 */
app.notFound((c) => {
	return c.json(
		{
			status: "FAILED",
			message: "🚫 Requested route not found, please enter a valid route",
			error: "invalid_route",
		} satisfies ServerResponse,
		404,
	);
});

/* -----------------------------------------------------------------------------------------------
 * Global Error Handler
 * -----------------------------------------------------------------------------------------------*/
app.onError((err, c) => {
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
