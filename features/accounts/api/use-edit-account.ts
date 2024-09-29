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
            // It's okay if the name is the same
            const response = await client.api.accounts[":id"]["$patch"]({
                 json,
                 param: { id }   
            })

            return await response.json()
        },
        onSuccess: () => {
            toast.success("Account updated")
            
            queryClient.invalidateQueries({ queryKey: ["accounts", { id }] })
            queryClient.invalidateQueries({ queryKey: ["accounts"] })
            // TODO: need to invalidate summary/transactions
        },
        onError: (error: Error) => {
            toast.error("Failed to edit account")
        },
    })

    return mutation
}