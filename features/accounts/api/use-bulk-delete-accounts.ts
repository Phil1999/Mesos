import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// We have to chain with this syntax instead of just .$post
type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"]


export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({ json })
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Accounts deleted")
            // Allows us to refetch accounts after a new one is created
            queryClient.invalidateQueries({ queryKey: ["accounts"] })
            // TODO: also invalidate summary later
            // We invalidate transaction because we can delete it in the transaction page as well.
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
        },
        onError: () => {
            toast.error("Failed to delete accounts")
        },
    })

    return mutation
}