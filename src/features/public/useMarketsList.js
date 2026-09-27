import { useQuery } from '@tanstack/react-query'
import { getAllMarketsPublic } from '@/services/publicService'

export function useMarketsList() {
  return useQuery({
    queryKey: ['allMarketsPublic'],
    queryFn: getAllMarketsPublic,
  })
}