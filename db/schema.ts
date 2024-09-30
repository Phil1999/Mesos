import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod"

export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
}, (table) => ({
    uniqueUserAccountName: uniqueIndex("unique_user_account_name").on(table.userId, table.name)
}))

export const insertAccountSchema = createInsertSchema(accounts)


