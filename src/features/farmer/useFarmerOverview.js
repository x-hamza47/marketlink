import { useQuery } from '@tanstack/react-query'
import { getFarmerOverviewStats, getFarmerRecentOrders , getFarmerOrderAnalytics } from '@/services/farmerService'

export function useFarmerOverviewStats() {
  return useQuery({
    queryKey: ['farmer-overview-stats'],
    queryFn: getFarmerOverviewStats,
  })
}

export function useFarmerRecentOrders() {
  return useQuery({
    queryKey: ['farmer-recent-orders'],
    queryFn: getFarmerRecentOrders,
  })
}
export function useFarmerOrderAnalytics(range = '7D') {
  return useQuery({
    queryKey: ['farmer-order-analytics', range],
    queryFn: () => getFarmerOrderAnalytics(range),
  })
}