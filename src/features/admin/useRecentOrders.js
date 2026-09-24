import { useQuery } from '@tanstack/react-query'
import { getRecentOrders } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'

export function useRecentOrders() {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, 'recent'],
    queryFn: getRecentOrders,
  })
}