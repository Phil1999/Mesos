import { useState } from "react";

import { Button } from "@/components/ui/button";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

/**
 * This hook provides a reusable confirmation dialog. 
 * It returns a JSX element to render the dialog and a function (confirm) to trigger the dialog and wait for user input.
 *
 * @param {string} title - The title displayed in the confirmation dialog
 * @param {string} message - The message displayed in the confirmation dialog
 * @returns {[() => JSX.Element, () => Promise<unknown>]} - An array containing the JSX element for the dialog and a function to trigger the confirmation.
 */
export const useConfirm = (
    title: string,
    message: string,
) : [() => JSX.Element, () => Promise<unknown>] => {

     // The 'promise' state holds the resolve function of a promise.
    // When the dialog is shown, we store the resolve function here.
    // When the user clicks Confirm or Cancel, we'll call the resolve function.
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void} | null>(null)

    /**
     * Triggers the confirmation dialog and returns a promise.
     * The promise resolves with 'true' if the user confirms, or 'false' if the user cancels.
     */
    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve })
    })

    /**
     * Closes the confirmation dialog by setting 'promise' to null, which hides the dialog.
     */
    const handleClose = () => {
        setPromise(null)
    }

    /**
     * Called when the user clicks the Confirm button.
     * Resolves the promise with 'true' and closes the dialog.
     */
    const handleConfirm = () => {
        promise?.resolve(true)
        handleClose()
    }

    /**
     * Called when the user clicks the Cancel button.
     * Resolves the promise with 'false' and closes the dialog.
     */
    const handleCancel = () => {
        promise?.resolve(false)
        handleClose()
    }

     /**
     * The confirmation dialog component.
     * It shows the dialog if 'promise' is not null (meaning the dialog has been triggered).
     */
    const ConfirmationDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                </DialogHeader>
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

    // Return the ConfirmationDialog component (for rendering the dialog) and the confirm() function (to trigger it).
    return [ConfirmationDialog, confirm]
}
