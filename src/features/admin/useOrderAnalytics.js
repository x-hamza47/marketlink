import { useQuery } from '@tanstack/react-query'
import { getOrderAnalytics } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'

export function useOrderAnalytics(range) {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS, 'order-trend', range],
    queryFn: () => getOrderAnalytics(range),
  })
}