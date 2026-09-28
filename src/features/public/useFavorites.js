import { useQuery } from '@tanstack/react-query'
import { getFavoriteFarmers, getFavoriteProducts } from '@/services/favoritesService'
import { useAuthStore } from '@/stores/authStore'

export function useFavoriteFarmers() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['favoriteFarmers'],
    queryFn: getFavoriteFarmers,
    enabled: !!isAuthenticated,
  })
}

export function useFavoriteProducts() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['favoriteProducts'],
    queryFn: getFavoriteProducts,
    enabled: !!isAuthenticated,
  })
}