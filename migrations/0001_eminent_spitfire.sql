CREATE TABLE IF NOT EXISTS "magadh_bookstore_author" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"total_revenue" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "magadh_bookstore_book" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"authors" text[] NOT NULL,
	"sell_count" integer DEFAULT 0 NOT NULL,
	"price" numeric DEFAULT 100 check (price >= 100 and price <= 1000) NOT NULL,
	CONSTRAINT "magadh_bookstore_book_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "magadh_bookstore_purchase_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"book_id" uuid NOT NULL,
	"purchase_date" date NOT NULL,
	"price" numeric NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "magadh_bookstore_purchase_history" ADD CONSTRAINT "magadh_bookstore_purchase_history_user_id_magadh_bookstore_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "magadh_bookstore_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "magadh_bookstore_purchase_history" ADD CONSTRAINT "magadh_bookstore_purchase_history_book_id_magadh_bookstore_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "magadh_bookstore_book"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
