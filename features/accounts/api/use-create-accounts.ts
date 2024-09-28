import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.accounts.$post>
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"]

// Define the possible response types from the API
type ApiResponse = 
  | { error: string } 
  | { data: { id: string; name: string; userId: string } };

export const useCreateAccount = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts.$post({ json })

            
            const responseData: ApiResponse = await response.json()

            // Check if the response contains an error
            if (!response.ok || 'error' in responseData) {
                // If 'error' is in the responseData, it's an error object
                if ('error' in responseData) {
                    throw new Error(responseData.error);
                }
                throw new Error("Failed to create account");
            }

            return responseData
        },
        onSuccess: () => {
            toast.success("Account created")
            // Allows us to refetch accounts after a new one is created
            queryClient.invalidateQueries({ queryKey: ["accounts"] })
        },
        onError: (error: Error) => {
            if (error.message.includes("Account with the same name already exists")) {
                toast.error("An account with this name already exists. Please choose a different name.");
            } else if (error.message.includes("Unauthorized")) {
                toast.error("You are not authorized to perform this action.");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        },
    })

    return mutation
}