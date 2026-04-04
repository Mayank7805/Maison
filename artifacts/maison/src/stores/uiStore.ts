import { create } from 'zustand'

interface UIState {
  cartOpen: boolean
  searchOpen: boolean
  mobileMenuOpen: boolean
  
  openCart: () => void
  closeCart: () => void
  openSearch: () => void
  closeSearch: () => void
  toggleMobileMenu: () => void
}

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  searchOpen: false,
  mobileMenuOpen: false,
  
  openCart: () => set({ cartOpen: true, mobileMenuOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  openSearch: () => set({ searchOpen: true, mobileMenuOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }))
}))
