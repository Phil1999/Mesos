import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

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

// Custom hook for selecting an account through a dialog box.
// Opens a dialog that allows users to select an account from a list (or create a new one)
// and returns the selected account when the user confirms their choice.
export const useSelectAccount = () : [() => JSX.Element, () => Promise<unknown>] => {

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    
    const onCreateAccount = (name: string) => accountMutation.mutate({
        name
    })

    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }))

    const isLoading = accountQuery.isFetching || accountMutation.isPending;
    

    const [promise, setPromise] = useState<{
        resolve: (value: string | undefined) => void
    } | null>(null)

    // We use ref to avoid the component rerendering and avoid flashing on the dialog.
    // E.g. every keystroke causes a flash.
    const selectValue = useRef<string>()

    // Clear the promise and selectValue on dialog close
    const handleClose = () => {
        setPromise(null);
        selectValue.current = undefined; // Clear value when closing
    };

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve })
    })

    const handleConfirm = () => {
        promise?.resolve(selectValue.current);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(undefined);
        handleClose();
    };

    // Currently, the component shows a processing account creation dialog when the user creates a new account to prevent "flickering"
    // the temporary solution is just to inform the user that we're creating their new account, but we should
    // eventually fix the unnecessary rerenders.
    const ConfirmationDialog = () => {
        return (
            <Dialog open={promise !== null} onOpenChange={handleClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select Account</DialogTitle>
                        <DialogDescription>
                            {isLoading ? 'Processing account creation...' : 'Please select an account to continue.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Select
                        placeholder="Select an account"
                        options={accountOptions}
                        onCreate={onCreateAccount}
                        onChange={(value) => (selectValue.current = value)}
                        disabled={isLoading}
                    />
                    <DialogFooter className="pt-2">
                        <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin size-4" /> : 'Confirm'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    return [ConfirmationDialog, confirm];
};