import type { Config } from "drizzle-kit";

import { env } from "@/lib/env";

export default {
	schema: "./src/lib/db/schema",
	out: "./migrations",
	driver: "pg",
	dbCredentials: { connectionString: env.DATABASE_URL },
	tablesFilter: [`${env.DATABASE_NAME}_*`],
} satisfies Config;
