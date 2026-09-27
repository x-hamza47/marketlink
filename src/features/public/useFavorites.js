import { useQuery } from '@tanstack/react-query'
import { getFavoriteFarmers, getFavoriteProducts } from '@/services/favoritesService'

export function useFavoriteFarmers() {
  return useQuery({ queryKey: ['favoriteFarmers'], queryFn: getFavoriteFarmers })
}

export function useFavoriteProducts() {
  return useQuery({ queryKey: ['favoriteProducts'], queryFn: getFavoriteProducts })
}