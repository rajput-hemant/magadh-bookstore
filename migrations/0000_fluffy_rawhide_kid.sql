DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('admin', 'user', 'author');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "magadh_bookstore_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"username" text,
	"password" text NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	CONSTRAINT "magadh_bookstore_user_email_unique" UNIQUE("email"),
	CONSTRAINT "magadh_bookstore_user_username_unique" UNIQUE("username")
);
