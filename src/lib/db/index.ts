import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "../env";
import * as schema from "./schema";

const client = postgres(env.DATABASE_URL, { max: 2 });

export const db = drizzle(client, { schema });
