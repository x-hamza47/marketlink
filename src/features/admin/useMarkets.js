import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMarkets, getMarketStats, createMarket, updateMarketStatus, deleteMarket } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'
import { toast } from 'sonner'


// ---------- Queries ----------

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


// ---------- Mutations ----------

export function useCreateMarket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (marketData) => createMarket(marketData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MARKETS] })
      toast.success('Market created')
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to create market.')
    },
  })
}

export function useUpdateMarketStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ marketId, status }) => updateMarketStatus(marketId, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MARKETS] })
      toast.success(`Market ${variables.status === 'active' ? 'activated' : 'deactivated'}`)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update market status.')
    },
  })
}

export function useDeleteMarket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (marketId) => deleteMarket(marketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MARKETS] })
      toast.success('Market removed')
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to remove market.')
    },
  })
}