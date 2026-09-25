import { useQuery } from '@tanstack/react-query'
import { getMarkets, getMarketStats, createMarket, updateMarketStatus, deleteMarket } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'
import { useAdminMutation } from '@/hooks/useAdminMutation'

export function useMarkets() {
  return useQuery({
    queryKey: [QUERY_KEYS.MARKETS],
    queryFn: getMarkets,
  })
}

export function useMarketStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.MARKETS, 'stats'],
    queryFn: getMarketStats,
  })
}

export function useCreateMarket() {
  return useAdminMutation({
    mutationFn: createMarket,
    queryKey: QUERY_KEYS.MARKETS,
    successMessage: 'Market created',
    errorMessage: 'Failed to create market.',
  })
}

export function useUpdateMarketStatus() {
  return useAdminMutation({
    mutationFn: ({ marketId, status }) => updateMarketStatus(marketId, status),
    queryKey: QUERY_KEYS.MARKETS,
    getSuccessMessage: ({ status }) => `Market ${status === 'active' ? 'activated' : 'deactivated'}`,
    errorMessage: 'Failed to update market status.',
  })
}

export function useDeleteMarket() {
  return useAdminMutation({
    mutationFn: deleteMarket,
    queryKey: QUERY_KEYS.MARKETS,
    successMessage: 'Market removed',
    errorMessage: 'Failed to remove market.',
  })
}