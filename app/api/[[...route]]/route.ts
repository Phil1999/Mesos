import { z } from "zod";
import { Hono } from 'hono'
import { HTTPException } from "hono/http-exception";
import { handle } from 'hono/vercel'
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import accounts from "./accounts"

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return err.getResponse()
    }

    return c.json({ error: "Internal error "}, 500)
})

const routes = app
    .route("/accounts", accounts)
    

export const GET = handle(app)
export const POST = handle(app)

export type AppType = typeof routes