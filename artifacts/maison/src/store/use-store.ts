import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  guestId: string;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      guestId: crypto.randomUUID(),
    }),
    { 
      name: 'maison-store',
      partialize: (state) => ({ guestId: state.guestId }),
    }
  )
);
