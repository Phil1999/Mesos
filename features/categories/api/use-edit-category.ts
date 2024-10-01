import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"]


export const useEditCategory = (id?: string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories[":id"]["$patch"]({
                 json,
                 param: { id }   
            })

            const responseData = await response.json();

            if (!response.ok || 'error' in responseData) {
                // Narrow down type for TypeScript
                if ('error' in responseData) {
                    throw new Error(responseData.error);
                }
            }


            return responseData
        },
        onSuccess: () => {
            toast.success("Category updated")
            
            queryClient.invalidateQueries({ queryKey: ["categories", { id }] })
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            // We invalidate transaction because we can edit it in the transaction page as well.
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
        },
        onError: (error: Error) => {
            // We want to prevent duplicate names
            if (error.message.includes("A category with this name already exists")) {
                toast.error("Category with this name already exists. Please choose a different name.");
            } else {
                toast.error("Failed to edit category")
            }
        },
    })

    return mutation
}