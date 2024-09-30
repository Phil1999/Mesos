import { z } from "zod"
import { parse, subDays } from "date-fns"
import { Hono } from "hono"
import { eq, and, inArray, ne, gte, lte, desc, sql } from "drizzle-orm"
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"
import { zValidator } from "@hono/zod-validator"
import { createId } from "@paralleldrive/cuid2"

import { db } from "@/db/drizzle"
import {
    transactions,
    insertTransactionSchema,
    categories,
    accounts
} from "@/db/schema"

const app = new Hono()
    .get(
        "/",
        zValidator("query", z.object({
            // We allow our transaction to be filtered optionally
            // by a date or account id.
            from: z.string().optional(),
            to: z.string().optional(),
            accountId: z.string().optional(),
        })),
        clerkMiddleware(), 
        async (c) => {
            const auth = getAuth(c)
            const { from, to, accountId } = c.req.valid("query")

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401)
            }

            // Default to last 30d if not given a value.
            const defaultTo = new Date()
            const defaultFrom = subDays(defaultTo, 30)

            const startDate = from
            ? parse(from, "yyyy-MM-dd", new Date())
            : defaultFrom

            const endDate = to
            ? parse(to, "yyyy-MM-dd", new Date())
            : defaultTo

            const data = await db
                .select({
                    id: transactions.id,
                    amount: transactions.amount,
                    payee: transactions.payee,
                    notes: transactions.notes,
                    date: transactions.date,

                    // We want the actual category not only the ID.
                    // So we will need a join.
                    category: categories.name,
                    categoryId: transactions.categoryId,
                    
                    // Account as well.
                    account: accounts.name,
                    accountId: transactions.accountId,
                })
                .from(transactions)
                // Ensure both tables exist (match transactions to an account)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                // It's fine if a category doesn't exist, so only left join.
                .leftJoin(categories, eq(transactions.categoryId, categories.id))
                .where(
                    and(
                        // If passed an accountId, get transactions from that account only
                        accountId ? eq(transactions.accountId, accountId) : undefined,
                        eq(accounts.userId, auth.userId),
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate),
                    )
                )
                // Order transactions by date by default.
                .orderBy(desc(transactions.date))

        return c.json({ data })
    })
    .get(
        "/:id",
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c)
            const { id } = c.req.valid("param")

            if (!id) {
                return c.json({ error: "Missing Id"}, 400)
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401)
            }

            const [data] = await db
            .select({
                id: transactions.id,
                amount: transactions.amount,
                payee: transactions.payee,
                notes: transactions.notes,
                date: transactions.date,
                categoryId: transactions.categoryId,
                accountId: transactions.accountId,
            })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(
                and(
                    eq(transactions.id, id),
                    eq(accounts.userId, auth.userId)
                )
            )

            if (!data) {
                return c.json({ error: "Not found"}, 404)
            }

            return c.json({ data })
        }
    )
    .post(
        "/",
        clerkMiddleware(),
        zValidator("json", insertTransactionSchema.omit({
            id: true,
        })),
        async (c) => {
            const auth = getAuth(c)
            const values = c.req.valid("json")

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401)
            }

            const [data] = await db.insert(transactions).values({
                id: createId(),
                 ...values,
            }).returning() // Insert doesnt return anything by default

            return c.json({data})

        }
    )
    .post(
        "/bulk-delete",
        clerkMiddleware(),
        zValidator(
            "json",
            z.object({
                ids: z.array(z.string())
            })
        ),
        async (c) => {
            const auth = getAuth(c)
            const values = c.req.valid("json")

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401)
            }

            // We need to find out what transaction we'll need to delete first.
            // Transaction belongs to accounts not users.
            const transactionsToDelete = db.$with("transactions_to_delete").as(
                db.select({ id: transactions.id }).from(transactions)
                // Load transactions which have an account
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(and(
                    // Check that the transaction id matches the id of one of the
                    // ids passed in.
                    inArray(transactions.id, values.ids),
                    eq(accounts.userId, auth.userId)
                ))
            )

            // We need a chained query
            const data = await db
                .with(transactionsToDelete)
                .delete(transactions)
                .where(
                    // Only delete transactions that match from our list of matched IDs.
                    inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
                )
                .returning({
                    id: transactions.id,
                })

            return c.json({ data })
        }
    )
    .patch(
        "/:id",
        clerkMiddleware(),
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        zValidator("json", insertTransactionSchema.omit({
            id: true,
        })),
        async (c) => {
            const auth = getAuth(c)
            const { id } = c.req.valid("param")
            const values = c.req.valid("json")

            if (!id) {
                return c.json({ error: "Missing id"}, 400)
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401)
            }


            // We need to find out what transaction we'll need to update first.
            // Transaction belongs to accounts not users.
            const transactionsToUpdate = db.$with("transactions_to_update").as(
                db.select({ id: transactions.id }).from(transactions)
                // Load transactions which have an account
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(and(
                    eq(transactions.id, id),
                    eq(accounts.userId, auth.userId)
                ))
            )

            const [data] = await db
                .with(transactionsToUpdate)
                .update(transactions)
                .set(values)
                .where(
                    inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)
            )
            .returning()

            if (!data) {
                return c.json({ error: "Not found"}, 404)
            }

            return c.json({ data })

        },
    )
    .delete(
        "/:id",
        clerkMiddleware(),
        zValidator("param", z.object({
            id: z.string().optional(),
        })),
        async (c) => {
            const auth = getAuth(c)
            const { id } = c.req.valid("param")

            if (!id) {
                return c.json({ error: "Missing id"}, 400)
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401)
            }

             // We need to find out what transaction we'll need to delete first.
            // Transaction belongs to accounts not users.
            const transactionsToDelete = db.$with("transactions_to_delete").as(
                db.select({ id: transactions.id }).from(transactions)
                // Load transactions which have an account
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(and(
                    eq(transactions.id, id),
                    eq(accounts.userId, auth.userId)
                ))
            )

            const [data] = await db
                .with(transactionsToDelete)
                .delete(transactions)
                .where(
                    inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
                )
                .returning({
                    id: transactions.id,
                })

            if (!data) {
                return c.json({ error: "Not found"}, 404)
            }

            return c.json({ data })

        },
    )

export default app