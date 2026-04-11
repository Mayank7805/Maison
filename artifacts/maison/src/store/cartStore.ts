"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => set((state) => {
        const existing = state.items.find(
          i => i.productId === item.productId && 
               i.variantId === item.variantId
        )
        if (existing) {
          return {
            items: state.items.map(i =>
              i.productId === item.productId && 
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          }
        }
        return { items: [...state.items, item] }
      }),
      removeItem: (productId, variantId) => set((state) => ({
        items: state.items.filter(
          i => !(i.productId === productId && 
                 i.variantId === variantId)
        )
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        items: quantity === 0
          ? state.items.filter(i => i.productId !== productId)
          : state.items.map(i =>
              i.productId === productId 
                ? { ...i, quantity } 
                : i
            )
      })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getTotalItems: () => 
        get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalPrice: () => 
        get().items.reduce(
          (sum, i) => sum + i.price * i.quantity, 0
        ),
    }),
    { name: "maison-cart" }
  )
)
