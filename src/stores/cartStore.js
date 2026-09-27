import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      farmerId: null,
      farmerName: '',
      market: null, // { marketId, marketName, operatingDays, pickupStart, pickupEnd, cutoffHours }

      addItem: (product, market) => {
        const { farmerId, items } = get()

        // Block adding from a different farmer
        if (farmerId && farmerId !== product.farmerId) {
          toast.error(`Your cart has items from ${get().farmerName}. Clear cart to order from a different farmer.`)
          return
        }

        const quantityToAdd = product.quantity || 1
        const existing = items.find((i) => i.id === product.id)

        set({
          farmerId: product.farmerId,
          farmerName: product.farmer,
          market: market || get().market,
          items: existing
            ? items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + quantityToAdd } : i
              )
            : [...items, { ...product, quantity: quantityToAdd }],
        })
      },

      removeItem: (productId) => {
        const remaining = get().items.filter((i) => i.id !== productId)
        set({
          items: remaining,
          // Reset farmer/market lock once cart is empty
          farmerId: remaining.length ? get().farmerId : null,
          farmerName: remaining.length ? get().farmerName : '',
          market: remaining.length ? get().market : null,
        })
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

      setMarket: (market) => set({ market }),

      clearCart: () => set({ items: [], farmerId: null, farmerName: '', market: null }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'marketlink-cart' }
  )
)