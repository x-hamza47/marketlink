import { useQuery } from '@tanstack/react-query'
import { getOrderAnalytics } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'

/**
 * Hook for the Order Analytics chart.
 * Refetches automatically whenever `range` changes (7D/30D/3M/12M)
 * because it's part of the queryKey — TanStack Query treats each
 * range as a separate cached entry.
 */
export function useOrderAnalytics(range) {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS, 'order-trend', range],
    queryFn: () => getOrderAnalytics(range),
  })
}