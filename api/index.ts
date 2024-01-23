import { Hono } from "hono";
import { showRoutes } from "hono/dev";

const app = new Hono({ strict: false });

app.get("/", (c) => c.text("Hello Bun!"));

showRoutes(app, { colorize: true });

export default app;
