import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCustomerOrders, cancelCustomerOrder } from '@/services/publicService'
import { toast } from 'sonner'

export function useCustomerOrders() {
  return useQuery({
    queryKey: ['customerOrders'],
    queryFn: getCustomerOrders,
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderId) => cancelCustomerOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerOrders'] })
      toast.success('Order cancelled')
    },
    onError: () => toast.error('Could not cancel order. Try again.'),
  })
}