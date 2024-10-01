import { useState, useRef } from "react";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

//TODO flickering on new account creation due to refetching?.

// Custom hook for selecting an account through a dialog box.
// Opens a dialog that allows users to select an account from a list (or create a new one)
// and returns the selected account when the user confirms their choice.
export const useSelectAccount = () : [() => JSX.Element, () => Promise<unknown>] => {

    const accountQuery = useGetAccounts()
    const accountMutation = useCreateAccount()
    const onCreateAccount = (name: string) => accountMutation.mutate({
        name
    })

    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }))

    const isLoading = 
        accountQuery.isPending ||
        accountMutation.isPending


    const [promise, setPromise] = useState<{
        resolve: (value: string | undefined) => void
    } | null>(null)

    // We use ref to avoid the component rerendering and avoid flashing on the dialog.
    // E.g. every keystroke causes a flash.
    const selectValue = useRef<string>()


    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve })
    })


    const handleClose = () => {
        setPromise(null)
    }


    const handleConfirm = () => {
        promise?.resolve(selectValue.current)
        handleClose()
    }


    const handleCancel = () => {
        promise?.resolve(undefined)
        handleClose()
    }



    const ConfirmationDialog = () => (
        <Dialog
            open={promise !== null}
            onOpenChange={(isOpen) => {
                if (!isOpen) handleClose() // Close the dialog if user clicks "X" button.
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Select Account
                    </DialogTitle>
                    <DialogDescription>
                        Please select an account to continue.
                    </DialogDescription>
                </DialogHeader>
                <Select
                    placeholder="Select an account"
                    options={accountOptions}
                    onCreate={onCreateAccount}
                    onChange={(value) => selectValue.current = value}
                    disabled={isLoading}
                />
                <DialogFooter className="pt-2">
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

   
    return [ConfirmationDialog, confirm]
}
