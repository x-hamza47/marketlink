import { useQuery } from '@tanstack/react-query'
import { getReportsSummary, getRevenueByMarket, getTopFarmers } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'

export function useReportsSummary() {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, 'summary'],
    queryFn: getReportsSummary,
  })
}

export function useRevenueByMarket() {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, 'revenue-by-market'],
    queryFn: getRevenueByMarket,
  })
}

export function useTopFarmers(limit = 5) {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS, 'top-farmers', limit],
    queryFn: () => getTopFarmers(limit),
  })
}