import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,

	/**
	 * Makes it so that empty strings are treated as undefined.
	 * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,

	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),

		DATABASE_NAME: z
			.string({ required_error: "DATABASE_NAME is required" })
			.max(25, { message: "DATABASE_NAME must be 25 characters or less" })
			.regex(/^[a-z_]+$/, {
				message:
					"DATABASE_NAME must be lowercase and contain only letters and underscores",
			}),

		DATABASE_URL: z
			.string({ required_error: "DATABASE_URL is required" })
			.url({
				message:
					"DATABASE_URL must be a valid URL (e.g. postgres://user:pass@host:port/db)",
			})
			.regex(/^postgres:\/\//, {
				message: "DATABASE_URL must be a postgres URL",
			}),
	},

	runtimeEnv: process.env,
});
