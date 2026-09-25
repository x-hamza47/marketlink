import { useQuery } from '@tanstack/react-query'
import { getCustomers } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'

export function useCustomers() {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS],
    queryFn: getCustomers,
  })
}