import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  toggleFavoriteFarmer as apiToggleFarmer,
  getFavoriteFarmers,
  toggleFavoriteProduct as apiToggleProduct,
  getFavoriteProducts,
} from '@/services/favoritesService'
import { queryClient } from '@/lib/queryClient'
import { toast } from 'sonner'

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      farmerIds: [],
      productIds: [],

      loadFavorites: async () => {
        const token = localStorage.getItem('marketlink_token')
        if (!token) {
          set({ farmerIds: [], productIds: [] })
          return
        }
        try {
          const [farmers, products] = await Promise.all([
            getFavoriteFarmers(),
            getFavoriteProducts(),
          ])
          set({
            farmerIds: (farmers || []).filter(Boolean).map((f) => String(f._id || f.id)),
            productIds: (products || []).filter(Boolean).map((p) => String(p._id || p.id)),
          })
        } catch {
          // ignore error if not logged in
        }
      },

      clearFavorites: () => {
        set({ farmerIds: [], productIds: [] })
      },

      toggleFavoriteFarmer: async (farmerId) => {
        const token = localStorage.getItem('marketlink_token')
        if (!token) {
          toast.error('Please log in to save favorites')
          return
        }
        const strId = String(farmerId)
        const wasFav = get().farmerIds.includes(strId)
        set({
          farmerIds: wasFav
            ? get().farmerIds.filter((id) => id !== strId)
            : [...get().farmerIds, strId],
        })
        try {
          await apiToggleFarmer(strId)
          queryClient.invalidateQueries({ queryKey: ['favoriteFarmers'] })
        } catch {
          set({
            farmerIds: wasFav
              ? [...get().farmerIds, strId]
              : get().farmerIds.filter((id) => id !== strId),
          })
          toast.error('Could not update favorite')
        }
      },

      toggleFavoriteProduct: async (productId) => {
        const token = localStorage.getItem('marketlink_token')
        if (!token) {
          toast.error('Please log in to save favorites')
          return
        }
        const strId = String(productId)
        const wasFav = get().productIds.includes(strId)
        set({
          productIds: wasFav
            ? get().productIds.filter((id) => id !== strId)
            : [...get().productIds, strId],
        })
        try {
          await apiToggleProduct(strId)
          queryClient.invalidateQueries({ queryKey: ['favoriteProducts'] })
        } catch {
          set({
            productIds: wasFav
              ? [...get().productIds, strId]
              : get().productIds.filter((id) => id !== strId),
          })
          toast.error('Could not update favorite')
        }
      },

      isFavoriteFarmer: (farmerId) => farmerId != null && get().farmerIds.includes(String(farmerId)),
      isFavoriteProduct: (productId) => productId != null && get().productIds.includes(String(productId)),
    }),
    { name: 'marketlink-favorites' }
  )
)