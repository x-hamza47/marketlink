import { useQuery } from '@tanstack/react-query'
import { getFeaturedProducts } from '@/services/publicService'

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts,
  })
}