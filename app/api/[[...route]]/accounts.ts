import { z } from "zod"
import { Hono } from "hono"
import { eq, and, inArray } from "drizzle-orm"
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"
import { zValidator } from "@hono/zod-validator"
import { createId } from "@paralleldrive/cuid2"

import { db } from "@/db/drizzle"
import { accounts, insertAccountSchema } from "@/db/schema"

const app = new Hono()
    .get("/",
        clerkMiddleware(), 
        async (c) => {
            const auth = getAuth(c)

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401)
            }

            const data = await db
                .select({
                    id: accounts.id,
                    name: accounts.name,
                })
                .from(accounts)
                .where(eq(accounts.userId, auth.userId))

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
                id: accounts.id,
                name: accounts.name,
            })
            .from(accounts)
            .where(
                and(
                    eq(accounts.userId, auth.userId),
                    eq(accounts.id, id)
                ),
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
        zValidator("json", insertAccountSchema.pick({
            // Only take name
            name: true,
        })),
        async (c) => {
            const auth = getAuth(c)
            const values = c.req.valid("json")

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized"}, 401)
            }

            // Application-level check for duplicate name
            const existingAccountName = await db
                .select({ id: accounts.id })
                .from(accounts)
                .where(and(
                    eq(accounts.userId, auth.userId),
                    eq(accounts.name, values.name)
                ))
                .limit(1)
            
            if (existingAccountName.length > 0) {
                return c.json({ error: "Account with the same name already exists"}, 400)
            }

            try {
                const [data] = await db.insert(accounts).values({
                    id: createId(),
                    userId: auth.userId,
                    ...values,
                }).returning() // Insert doesnt return anything by default

                return c.json({data})

            } catch (err) {
                // Type guard to check if the error is an object with a `code` property
                // 23505 is the error code for a uniqueness violation in postgreSQL
                if (typeof err === "object" && err !== null &&
                    "code" in err && (err as any).code === '23505') {
                    return c.json({ error: "Account with this name already exists" }, 400);
                }
                throw err;  // Rethrow the error if it's not the expected database error
            }
            
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

            const data = await db
                .delete(accounts)
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        inArray(accounts.id, values.ids)
                    )
                )
                .returning({
                    id: accounts.id
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
        zValidator("json", insertAccountSchema.pick({
            name: true,
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

            const [data] = await db
                .update(accounts)
                .set(values)
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        eq(accounts.id, id)
                    )
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

            const [data] = await db
                .delete(accounts)
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        eq(accounts.id, id)
                    )
            )
            .returning({
                id: accounts.id
            })

            if (!data) {
                return c.json({ error: "Not found"}, 404)
            }

            return c.json({ data })

        },
    )

export default app