"use client"

import { useMountedState } from "react-use"

import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet"

export const SheetProvider = () => {
    const isMounted = useMountedState()

    // Equivalent to a useEffect() on the isMounted state.
    // Fixes hydration issues due to mismatch between server/client rendering
    // E.g. it essentially just checks whether the component has mounted
    // or that the component has transitioned from SSR to CSR
    if (!isMounted) return null

    return (
        <>
            <NewAccountSheet />
        </>
    )
}