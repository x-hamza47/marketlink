import { useQuery } from '@tanstack/react-query'
import { getStallProfile, getAvailableMarkets, updateStallProfile } from '@/services/farmerService'
import { useAdminMutation } from '@/hooks/useAdminMutation'

const KEY = 'farmer-stall'

export function useStallProfile() {
  return useQuery({ queryKey: [KEY], queryFn: getStallProfile })
}

export function useAvailableMarkets() {
  return useQuery({ queryKey: ['available-markets'], queryFn: getAvailableMarkets })
}

export function useUpdateStallProfile() {
  return useAdminMutation({
    mutationFn: updateStallProfile,
    queryKey: KEY,
    successMessage: 'Stall profile updated',
    errorMessage: 'Failed to update stall profile.',
  })
}