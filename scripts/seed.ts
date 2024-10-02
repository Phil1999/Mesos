import { config } from "dotenv"
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { accounts, categories, transactions } from "@/db/schema"
import { convertAmountToMiliunits } from "@/lib/utils"
import { eachDayOfInterval, subDays, format } from "date-fns"

config({ path: ".env.local"})

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

const defaultTo = new Date()
const defaultFrom = subDays(defaultTo, 60)

const SEED_USER_ID = process.env.SEED_DB_USER_ID || ""

const SEED_CATEGORIES = [
    { id: "category_1", name: "Rent", userId: SEED_USER_ID},
    { id: "category_2", name: "Food", userId: SEED_USER_ID},
    { id: "category_3", name: "Transportation", userId: SEED_USER_ID},
    { id: "category_4", name: "Miscellaneous", userId: SEED_USER_ID},
]

const SEED_ACCOUNTS = [
    { id: "account_1", name: "Checkings", userId: SEED_USER_ID },
    { id: "account_2", name: "Savings", userId: SEED_USER_ID },
]

const SEED_TRANSACTIONS: typeof transactions.$inferSelect[] = []


const generateRandomAmount = (category: typeof categories.$inferInsert) => {
    switch (category.name) {
        case "Rent":
            return Math.random() * 400 + 90
        case "Food":
            return Math.random() * 30 + 10
        case "Transportation":
            return Math.random() * 20 + 15
        case "Miscellaneous":
             return Math.random() * 100 + 20

        default:
            return Math.random() * 25 + 25
    }
}

const generateTransactionsForDay = (day: Date) => {
    const numTransactions = Math.floor(Math.random() * 4) + 1 // limit to 1-4 transactions per day

    for (let i = 0; i < numTransactions; i++) {
        const category = SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)]

        const isExpense = Math.random() > 0.6 // Make it 60% chance of being expense

        const amount = generateRandomAmount(category)
        const formattedAmount = convertAmountToMiliunits(isExpense ? -amount: amount)

        SEED_TRANSACTIONS.push({
            id: `transactions_${format(day, "yyyy-MM-dd")}_${i}`,
            accountId: SEED_ACCOUNTS[0].id, // use first account for simplicity
            categoryId: category.id,
            date: day,
            amount: formattedAmount,
            payee: "Test Merchant",
            notes: "Random transactions",

        })
    }
}


const generateTransactions = () => {
    const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo })
    days.forEach(day => generateTransactionsForDay(day))
}

generateTransactions()

const main = async () => {
    try {
        // Reset database
        await db.delete(transactions).execute()
        await db.delete(accounts).execute()
        await db.delete(categories).execute()

        // Seed categories
        await db.insert(categories).values(SEED_CATEGORIES).execute()
        // Seed accounts
        await db.insert(accounts).values(SEED_ACCOUNTS).execute()
        // Seed transactions
        await db.insert(transactions).values(SEED_TRANSACTIONS).execute()

    } catch (error) {
        console.error("Error during seed: ", error)
        process.exit(1)
    }
}

main()
