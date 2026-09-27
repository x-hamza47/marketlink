import { useQuery } from '@tanstack/react-query'
import { getProducts, getPublicCategories } from '@/services/publicService'

export function useProducts(filters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    placeholderData: (prev) => prev,
  })
}

export function usePublicCategories() {
  return useQuery({
    queryKey: ['publicCategories'],
    queryFn: getPublicCategories,
  })
}