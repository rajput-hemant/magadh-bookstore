import { pgTableCreator } from "drizzle-orm/pg-core";
import { env } from "../env";

/**
 * Use to keep multiple projects schemas/tables in the same database.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
	(name) => `${env.DATABASE_NAME}_${name}`,
);
