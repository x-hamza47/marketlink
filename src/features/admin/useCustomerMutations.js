import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCustomerStatus, deleteCustomer } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'
import { toast } from 'sonner'

export function useUpdateCustomerStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ customerId, status }) => updateCustomerStatus(customerId, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] })
      toast.success(`Customer ${variables.status === 'active' ? 'activated' : 'deactivated'}`)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update customer status.')
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (customerId) => deleteCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] })
      toast.success('Customer removed')
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to remove customer.')
    },
  })
}