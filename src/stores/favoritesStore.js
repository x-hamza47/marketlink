import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  toggleFavoriteFarmer,
  getFavoriteFarmers,
  toggleFavoriteProduct,
  getFavoriteProducts,
} from '@/services/favoritesService'
import { toast } from 'sonner'

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      farmerIds: [],
      productIds: [],

      loadFavorites: async () => {
        try {
          const [farmers, products] = await Promise.all([
            getFavoriteFarmers(),
            getFavoriteProducts(),
          ])
          set({
            farmerIds: farmers.map((f) => f._id),
            productIds: products.map((p) => p._id),
          })
        } catch {
       
        }
      },

      toggleFavoriteFarmer: async (farmerId) => {
        const wasFav = get().farmerIds.includes(farmerId)
        set({
          farmerIds: wasFav
            ? get().farmerIds.filter((id) => id !== farmerId)
            : [...get().farmerIds, farmerId],
        })
        try {
          await toggleFavoriteFarmer(farmerId)
        } catch {
          set({
            farmerIds: wasFav
              ? [...get().farmerIds, farmerId]
              : get().farmerIds.filter((id) => id !== farmerId),
          })
          toast.error('Could not update favorite')
        }
      },

      toggleFavoriteProduct: async (productId) => {
        const wasFav = get().productIds.includes(productId)
        set({
          productIds: wasFav
            ? get().productIds.filter((id) => id !== productId)
            : [...get().productIds, productId],
        })
        try {
          await toggleFavoriteProduct(productId)
        } catch {
          set({
            productIds: wasFav
              ? [...get().productIds, productId]
              : get().productIds.filter((id) => id !== productId),
          })
          toast.error('Could not update favorite')
        }
      },

      isFavoriteFarmer: (farmerId) => get().farmerIds.includes(farmerId),
      isFavoriteProduct: (productId) => get().productIds.includes(productId),
    }),
    { name: 'marketlink-favorites' }
  )
)