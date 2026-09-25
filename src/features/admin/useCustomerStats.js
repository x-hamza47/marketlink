import { useQuery } from '@tanstack/react-query'
import { getCustomerStats } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'

export function useCustomerStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS, 'stats'],
    queryFn: getCustomerStats,
  })
}