import { useQuery } from '@tanstack/react-query'
import { getRecentOrders, getOrderStats, getOrderAnalytics, updateOrderStatus, deleteOrder } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'
import { useAdminMutation } from '@/hooks/useAdminMutation'

export function useOrders() {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS],
    queryFn: getRecentOrders,
  })
}

export function useRecentOrders() {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, 'recent'],
    queryFn: getRecentOrders,
  })
}

export function useOrderStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, 'stats'],
    queryFn: getOrderStats,
  })
}

export function useOrderAnalytics(range) {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS, 'order-trend', range],
    queryFn: () => getOrderAnalytics(range),
  })
}

export function useUpdateOrderStatus() {
  return useAdminMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    queryKey: QUERY_KEYS.ORDERS,
    getSuccessMessage: ({ orderId }) => `Order #${orderId} updated`,
    errorMessage: 'Failed to update order. Please try again.',
  })
}

export function useDeleteOrder() {
  return useAdminMutation({
    mutationFn: deleteOrder,
    queryKey: QUERY_KEYS.ORDERS,
    getSuccessMessage: (orderId) => `Order #${orderId} deleted`,
    errorMessage: 'Failed to delete order. Please try again.',
  })
}