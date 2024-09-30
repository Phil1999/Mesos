import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.categories.$post>
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"]


export const useCreateCategory = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories.$post({ json })

            
            const responseData = await response.json()

            // Check if the response contains an error
            if (!response.ok || 'error' in responseData) {
                // If 'error' is in the responseData, it's an error object
                if ('error' in responseData) {
                    throw new Error(responseData.error);
                }
                throw new Error("Failed to create category");
            }

            return responseData
        },
        onSuccess: () => {
            toast.success("Category created")
            // Allows us to refetch categories after a new one is created
            queryClient.invalidateQueries({ queryKey: ["categories"] })
        },
        onError: (error: Error) => {
            if (error.message.includes("Category with the same name already exists")) {
                toast.error("A category with this name already exists. Please choose a different name.");
            } else if (error.message.includes("Unauthorized")) {
                toast.error("You are not authorized to perform this action.");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        },
    })

    return mutation
}