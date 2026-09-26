import { useQuery } from '@tanstack/react-query'
import {
  getFarmerOrders,
  getFarmerOrderStats,
  updateFarmerOrderStatus,
} from '@/services/farmerService'
import { useAdminMutation } from '@/hooks/useAdminMutation'

const KEY = 'farmer-orders'

export function useFarmerOrders() {
  return useQuery({ queryKey: [KEY], queryFn: getFarmerOrders })
}

export function useFarmerOrderStats() {
  return useQuery({ queryKey: [KEY, 'stats'], queryFn: getFarmerOrderStats })
}

export function useUpdateFarmerOrderStatus() {
  return useAdminMutation({
    mutationFn: ({ orderId, status }) => updateFarmerOrderStatus(orderId, status),
    queryKey: KEY,
    getSuccessMessage: ({ status }) => {
      const labels = {
        accepted: 'Order accepted',
        declined: 'Order declined',
        ready_for_pickup: 'Marked ready for pickup',
        completed: 'Order marked completed',
      }
      return labels[status] || 'Order updated'
    },
    errorMessage: 'Failed to update order.',
  })
}