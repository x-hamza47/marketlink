import { useQuery } from '@tanstack/react-query'
import { getNearbyMarkets, getMarketById, getMarketProducts, getMarketFarmers } from '@/services/publicService'

export function useNearbyMarkets(filters) {
  return useQuery({
    queryKey: ['nearbyMarkets', filters],
    queryFn: () => getNearbyMarkets(filters),
  })
}

export function useMarketDetail(marketId) {
  return useQuery({
    queryKey: ['market', marketId],
    queryFn: () => getMarketById(marketId),
    enabled: !!marketId,
  })
}

export function useMarketProducts(marketId, { page = 1, limit = 12 } = {}) {
  return useQuery({
    queryKey: ['marketProducts', marketId, page, limit],
    queryFn: () => getMarketProducts(marketId, { page, limit }),
    enabled: !!marketId,
    placeholderData: (prev) => prev,
  })
}
export function useMarketFarmers(marketId) {
  return useQuery({
    queryKey: ['marketFarmers', marketId],
    queryFn: () => getMarketFarmers(marketId),
    enabled: !!marketId,
  })
}