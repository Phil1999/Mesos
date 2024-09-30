"use client"

import { useMountedState } from "react-use"

import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet"
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet"

import { NewCategorySheet } from "@/features/categories/components/new-category-sheet"
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet"



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
            <EditAccountSheet />

            <NewCategorySheet />
            <EditCategorySheet />
        </>
    )
}