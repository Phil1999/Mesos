import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// We have to chain with this syntax instead of just .$post
type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"]


export const useBulkDeleteCategories = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories["bulk-delete"]["$post"]({ json })
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Categories deleted")
            // Allows us to refetch categories after a new one is created
            queryClient.invalidateQueries({ queryKey: ["categories"] })

            // We invalidate transaction because we can delete it in the transaction page as well.
            queryClient.invalidateQueries({ queryKey: ["transactions"] })

            queryClient.invalidateQueries({ queryKey: ["summary"] })
        },
        onError: () => {
            toast.error("Failed to delete categories")
        },
    })

    return mutation
}