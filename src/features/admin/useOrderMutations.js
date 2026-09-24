import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateOrderStatus, deleteOrder } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'
import { toast } from 'sonner'

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