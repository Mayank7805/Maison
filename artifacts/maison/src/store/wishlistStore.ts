"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistStore {
  items: string[]
  toggleItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (productId) => set((state) => ({
        items: state.items.includes(productId)
          ? state.items.filter(id => id !== productId)
          : [...state.items, productId]
      })),
      isInWishlist: (productId) => 
        get().items.includes(productId),
    }),
    { name: "maison-wishlist" }
  )
)
