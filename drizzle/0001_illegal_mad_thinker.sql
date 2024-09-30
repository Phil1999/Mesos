CREATE TABLE IF NOT EXISTS "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_category_name" ON "categories" USING btree ("user_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_account_name" ON "accounts" USING btree ("user_id","name");