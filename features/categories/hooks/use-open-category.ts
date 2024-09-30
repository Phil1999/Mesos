import { create } from "zustand"


type OpenCategoryState = {
    id?: string
    isOpen: boolean
    onOpen: (id: string) => void
    onClose: () => void
}

// Useful for open/closing an open category modal.
export const useOpenCategory = create<OpenCategoryState>((set => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: undefined }),
})))