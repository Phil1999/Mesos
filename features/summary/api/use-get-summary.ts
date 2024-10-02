import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetSummary = () => {
    // Note: in our backend we default to retrieving from the last 30d.
    const params = useSearchParams()
    const from = params.get("from") || undefined
    const to = params.get("to") || undefined
    const accountId = params.get("accountId") || undefined

    const query = useQuery({
        // We need these params in the query key because different
        // combinations of these parameters can yield different sets of transactions
        // from our API.
        queryKey: ["summary", { from, to, accountId }],
        queryFn: async () => {
            const response = await client.api.summary.$get({
                query: {
                    from,
                    to,
                    accountId,
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch summary")
            }

            const { data } = await response.json()
            // Since in our backend, we store amounts in miliunits, we can format it here.
            return {
                ...data,
                incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
                expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
                remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
                categories: data.categories.map((category) => ({
                    ...category,
                    value: convertAmountFromMiliunits(category.value),
                })),
                days: data.days.map((day) => ({
                    ...day,
                    income: convertAmountFromMiliunits(day.income),
                    expenses: convertAmountFromMiliunits(day.expenses),
                }))
            }
        },
    })

    return query
}
