import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const quantityToAdd = product.quantity || 1
        const existing = get().items.find((i) => i.id === product.id)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + quantityToAdd } : i
            ),
          })
        } else {
          set({ items: [...get().items, { ...product, quantity: quantityToAdd }] })
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.id !== productId) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === productId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'marketlink-cart' }
  )
)