import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      productIds: [],

      toggleFavorite: (productId) => {
        const isFav = get().productIds.includes(productId)
        set({
          productIds: isFav
            ? get().productIds.filter((id) => id !== productId)
            : [...get().productIds, productId],
        })
      },

      isFavorite: (productId) => get().productIds.includes(productId),
    }),
    { name: 'marketlink-favorites' }
  )
)