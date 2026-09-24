import { useQuery } from '@tanstack/react-query'
import { getOverviewStats } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'


export function useOverviewStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS, 'admin-overview-stats'],
    queryFn: getOverviewStats,
  })
}