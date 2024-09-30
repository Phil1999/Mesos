import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"]


export const useEditAccount = (id?: string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts[":id"]["$patch"]({
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
            toast.success("Account updated")
            
            queryClient.invalidateQueries({ queryKey: ["accounts", { id }] })
            queryClient.invalidateQueries({ queryKey: ["accounts"] })
            // TODO: need to invalidate summary/transactions
        },
        onError: (error: Error) => {
            // We want to prevent duplicate names
            if (error.message.includes("An account with this name already exists")) {
                toast.error("Account with this name already exists. Please choose a different name.");
            } else {
                toast.error("Failed to edit account")
            }
        },
    })

    return mutation
}