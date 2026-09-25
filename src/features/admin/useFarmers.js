import { useQuery } from '@tanstack/react-query'
import { getFarmers, updateFarmerStatus, deleteFarmer } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'
import { useAdminMutation } from '@/hooks/useAdminMutation'

export function useFarmers() {
  return useQuery({
    queryKey: [QUERY_KEYS.FARMERS],
    queryFn: getFarmers,
  })
}

export function useUpdateFarmerStatus() {
  return useAdminMutation({
    mutationFn: ({ farmerId, status }) => updateFarmerStatus(farmerId, status),
    queryKey: QUERY_KEYS.FARMERS,
    getSuccessMessage: ({ status }) => `Farmer ${status === 'approved' ? 'approved' : status}`,
    errorMessage: 'Failed to update farmer status.',
  })
}

export function useDeleteFarmer() {
  return useAdminMutation({
    mutationFn: deleteFarmer,
    queryKey: QUERY_KEYS.FARMERS,
    successMessage: 'Farmer removed',
    errorMessage: 'Failed to remove farmer.',
  })
}