ALTER TABLE "magadh_bookstore_book" ALTER COLUMN "price" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "magadh_bookstore_purchase_history" ADD PRIMARY KEY ("user_id");--> statement-breakpoint
ALTER TABLE "magadh_bookstore_purchase_history" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "magadh_bookstore_purchase_history" ADD CONSTRAINT "magadh_bookstore_purchase_history_book_id_unique" UNIQUE("book_id");