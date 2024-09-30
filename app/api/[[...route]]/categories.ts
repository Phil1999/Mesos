import { z } from "zod"
import { Hono } from "hono"
import { eq, and, inArray, ne } from "drizzle-orm"
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"
import { zValidator } from "@hono/zod-validator"
import { createId } from "@paralleldrive/cuid2"

import { db } from "@/db/drizzle"
import { categories, insertCategorySchema } from "@/db/schema"

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
                    id: categories.id,
                    name: categories.name,
                })
                .from(categories)
                .where(eq(categories.userId, auth.userId))

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
                id: categories.id,
                name: categories.name,
            })
            .from(categories)
            .where(
                and(
                    eq(categories.userId, auth.userId),
                    eq(categories.id, id)
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
        zValidator("json", insertCategorySchema.pick({
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
            const existingCategoryName = await db
                .select({ id: categories.id })
                .from(categories)
                .where(and(
                    eq(categories.userId, auth.userId),
                    eq(categories.name, values.name)
                ))
                .limit(1)
            
            if (existingCategoryName.length > 0) {
                return c.json({ error: "Category with the same name already exists"}, 400)
            }

            try {
                const [data] = await db.insert(categories).values({
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
                    return c.json({ error: "Category with this name already exists" }, 400);
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
                .delete(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        inArray(categories.id, values.ids)
                    )
                )
                .returning({
                    id: categories.id
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
        zValidator("json", insertCategorySchema.pick({
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


            const duplicateCategory = await db
                .select({ id: categories.id })
                .from(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.name, values.name),
                        ne(categories.id, id) // Make sure its not current category
                    )
                )
                .limit(1)

            if (duplicateCategory.length > 0) {
                return c.json({ error: "A category with this name already exists"}, 400)
            }

            const [data] = await db
                .update(categories)
                .set(values)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id)
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
                .delete(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id)
                    )
            )
            .returning({
                id: categories.id
            })

            if (!data) {
                return c.json({ error: "Not found"}, 404)
            }

            return c.json({ data })

        },
    )

export default app