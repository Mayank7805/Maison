"use client"
import { create } from "zustand"

interface UIStore {
  searchOpen: boolean
  mobileMenuOpen: boolean
  openSearch: () => void
  closeSearch: () => void
  toggleMobileMenu: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  searchOpen: false,
  mobileMenuOpen: false,
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  toggleMobileMenu: () => 
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
}))
