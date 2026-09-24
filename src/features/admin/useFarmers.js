import { useQuery } from '@tanstack/react-query'
import { getFarmers } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'

export function useFarmers() {
  return useQuery({
    queryKey: [QUERY_KEYS.FARMERS],
    queryFn: getFarmers,
  })
}