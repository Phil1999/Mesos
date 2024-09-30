import { create } from "zustand"


type OpenAccountState = {
    id?: string
    isOpen: boolean
    onOpen: (id: string) => void
    onClose: () => void
}

// Useful for open/closing an open account modal.
export const useOpenAccount = create<OpenAccountState>((set => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: undefined }),
})))