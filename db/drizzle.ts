import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema"

export const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

const accounts = db.query.accounts.findFirst({
    where: eq(schema.accounts.id, "1")
})