import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRecentOrders, getOrderStats, updateOrderStatus, deleteOrder } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'
import { toast } from 'sonner'


// ---------- Queries ----------

export function useOrders() {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS],
    queryFn: getRecentOrders,
  })
}

export function useOrderStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, 'stats'],
    queryFn: getOrderStats,
  })
}


// ---------- Mutations ----------

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] })
      toast.success(`Order #${variables.orderId} updated`)
    },
    onError: () => {
      toast.error('Failed to update order. Please try again.')
    },
  })
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId) => deleteOrder(orderId),
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] })
      toast.success(`Order #${orderId} deleted`)
    },
    onError: () => {
      toast.error('Failed to delete order. Please try again.')
    },
  })
}