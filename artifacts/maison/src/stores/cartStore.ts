import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface CartItemType {
  id: string
  productId: string
  variantId?: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
}

interface CouponType {
  code: string
  discount: number
  type: 'PERCENTAGE' | 'FIXED'
}

interface CartState {
  items: CartItemType[]
  totalItems: number
  totalPrice: number
  coupon: CouponType | null
  discount: number
  _hasHydrated: boolean
  
  addItem: (item: CartItemType) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  applyCoupon: (coupon: CouponType) => void
  removeCoupon: () => void
  clearCart: () => void
  syncWithDB: (items: CartItemType[]) => void
  setHasHydrated: (state: boolean) => void
}

const calculateTotals = (items: CartItemType[], coupon: CouponType | null) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  let discount = 0
  if (coupon) {
    if (coupon.type === 'PERCENTAGE') {
      discount = subtotal * (coupon.discount / 100)
    } else {
      discount = coupon.discount
    }
  }
  
  return {
    totalItems,
    totalPrice: Math.max(0, subtotal - discount),
    discount
  }
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      coupon: null,
      discount: 0,
      _hasHydrated: false,
      
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id)
        if (existingItem) {
          existingItem.quantity += item.quantity
        } else {
          state.items.push(item)
        }
        const totals = calculateTotals(state.items, state.coupon)
        state.totalItems = totals.totalItems
        state.totalPrice = totals.totalPrice
        state.discount = totals.discount
      }),
      
      removeItem: (id) => set((state) => {
        state.items = state.items.filter(i => i.id !== id)
        const totals = calculateTotals(state.items, state.coupon)
        state.totalItems = totals.totalItems
        state.totalPrice = totals.totalPrice
        state.discount = totals.discount
      }),
      
      updateQuantity: (id, quantity) => set((state) => {
        const item = state.items.find(i => i.id === id)
        if (item) {
          item.quantity = Math.max(1, quantity)
        }
        const totals = calculateTotals(state.items, state.coupon)
        state.totalItems = totals.totalItems
        state.totalPrice = totals.totalPrice
        state.discount = totals.discount
      }),
      
      applyCoupon: (coupon) => set((state) => {
        state.coupon = coupon
        const totals = calculateTotals(state.items, coupon)
        state.totalPrice = totals.totalPrice
        state.discount = totals.discount
      }),
      
      removeCoupon: () => set((state) => {
        state.coupon = null
        const totals = calculateTotals(state.items, null)
        state.totalPrice = totals.totalPrice
        state.discount = totals.discount
      }),
      
      clearCart: () => set((state) => {
        state.items = []
        state.totalItems = 0
        state.totalPrice = 0
        state.coupon = null
        state.discount = 0
      }),
      
      syncWithDB: (items) => set((state) => {
        state.items = items
        const totals = calculateTotals(items, state.coupon)
        state.totalItems = totals.totalItems
        state.totalPrice = totals.totalPrice
        state.discount = totals.discount
      })
    })),
    {
      name: 'maison-cart',
      skipHydration: true,
    }
  )
)
