import { useQuery } from '@tanstack/react-query'
import { getCustomers, getCustomerStats, updateCustomerStatus, deleteCustomer } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'
import { useAdminMutation } from '@/hooks/useAdminMutation'

export function useCustomers() {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS],
    queryFn: getCustomers,
  })
}

export function useCustomerStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS, 'stats'],
    queryFn: getCustomerStats,
  })
}

export function useUpdateCustomerStatus() {
  return useAdminMutation({
    mutationFn: ({ customerId, status }) => updateCustomerStatus(customerId, status),
    queryKey: QUERY_KEYS.CUSTOMERS,
    getSuccessMessage: ({ status }) => `Customer ${status === 'active' ? 'activated' : 'deactivated'}`,
    errorMessage: 'Failed to update customer status.',
  })
}

export function useDeleteCustomer() {
  return useAdminMutation({
    mutationFn: deleteCustomer,
    queryKey: QUERY_KEYS.CUSTOMERS,
    successMessage: 'Customer removed',
    errorMessage: 'Failed to remove customer.',
  })
}