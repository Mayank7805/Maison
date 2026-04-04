import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface WishlistItemType {
  productId: string
}

interface WishlistState {
  items: WishlistItemType[]
  totalItems: number
  _hasHydrated: boolean
  
  addItem: (item: WishlistItemType) => void
  removeItem: (productId: string) => void
  toggleItem: (item: WishlistItemType) => void
  isInWishlist: (productId: string) => boolean
  setHasHydrated: (state: boolean) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    immer((set, get) => ({
      items: [],
      totalItems: 0,
      _hasHydrated: false,
      
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      
      addItem: (item) => set((state) => {
        if (!state.items.find(i => i.productId === item.productId)) {
          state.items.push(item)
          state.totalItems = state.items.length
        }
      }),
      
      removeItem: (productId) => set((state) => {
        state.items = state.items.filter(i => i.productId !== productId)
        state.totalItems = state.items.length
      }),
      
      toggleItem: (item) => set((state) => {
        const index = state.items.findIndex(i => i.productId === item.productId)
        if (index >= 0) {
          state.items.splice(index, 1)
        } else {
          state.items.push(item)
        }
        state.totalItems = state.items.length
      }),
      
      isInWishlist: (productId) => {
        return get().items.some(i => i.productId === productId)
      }
    })),
    {
      name: 'maison-wishlist',
      skipHydration: true,
    }
  )
)
