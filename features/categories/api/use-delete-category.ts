import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>


export const useDeleteCategory = (id?: string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.categories[":id"]["$delete"]({
                 param: { id }   
            })

            return await response.json()
        },
        onSuccess: () => {
            toast.success("Category deleted")
            
            queryClient.invalidateQueries({ queryKey: ["categories", { id }] })
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            // Todo invalidate summary.

            // We invalidate transaction because we can delete it in the transaction page as well.
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
        },
        onError: (error: Error) => {
            toast.error("Failed to delete category")
        },
    })

    return mutation
}