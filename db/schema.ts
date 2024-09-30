import { z } from "zod"
import {
    integer,
    pgTable,
    text,
    timestamp,
    uniqueIndex
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"

export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
}, (table) => ({
    uniqueUserAccountName: uniqueIndex("unique_user_account_name").on(table.userId, table.name)
}))

export const accountsRelation = relations(accounts, ({ many }) => ({
    transactions: many(transactions),
}))

export const insertAccountSchema = createInsertSchema(accounts)

export const categories = pgTable("categories", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
}, (table) => ({
    uniqueUserCategoryName: uniqueIndex("unique_user_category_name").on(table.userId, table.name)
}))

export const categoriesRelation = relations(categories, ({ many }) => ({
    transactions: many(transactions),
}))

export const insertCategorySchema = createInsertSchema(categories)

export const transactions = pgTable("transactions", {
    id: text("id").primaryKey(),

    // We use integer because
    // 1. Float is not precise
    // 2. Decimal / Numeric will be parsed as a string in JS
    // and it requires us to use additional libs and not cross-language
    // compatible.
    // For our integer implementation we can use miliunits to support up to 3 decimals.
    // $10.50 --> 10500
    amount: integer("amount").notNull(),

    payee: text("payee").notNull(),
    notes: text("notes"),
    date: timestamp("date", { mode: "date"}).notNull(),
    accountId: text("account_id").references(() => accounts.id, {
        // Remove all transactions associated to account on account deletion.
        onDelete: "cascade",
    }).notNull(),
    categoryId: text("category_id").references(() => categories.id, {
        // Set the category to uncategorized
        onDelete: "set null",
    })
    
})

export const transactionsRelations = relations(transactions, ({ one }) => ({
    account: one(accounts, {
        fields: [transactions.accountId],
        references: [accounts.id],
    }),
    categories: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    })
}))

export const insertTransactionSchema = createInsertSchema(transactions, {
    date: z.coerce.date(),
    categoryId: z.string().optional(),
})