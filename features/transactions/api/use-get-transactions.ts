import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { transactions } from "@/db/schema";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetTransactions = () => {
    // Note: in our backend we default to retrieving from the last 30d.
    const params = useSearchParams()
    const from = params.get("from") || ""
    const to = params.get("to") || ""
    const accountId = params.get("accountId") || ""

    const query = useQuery({
        // We need these params in the query key because different
        // combinations of these parameters can yield different sets of transactions
        // from our API.
        queryKey: ["transactions", { from, to, accountId }],
        queryFn: async () => {
            const response = await client.api.transactions.$get({
                query: {
                    from,
                    to,
                    accountId,
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch transactions")
            }

            const { data } = await response.json()
            // Since in our backend, we store amounts in miliunits, we can format it here.
            return data.map((transaction) => ({
                ...transaction,
                amount: convertAmountFromMiliunits(transaction.amount),
            }))
        },
    })

    return query
}
