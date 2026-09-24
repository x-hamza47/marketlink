import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateFarmerStatus, deleteFarmer } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'
import { toast } from 'sonner'

export function useUpdateFarmerStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ farmerId, status }) => updateFarmerStatus(farmerId, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FARMERS] })
      toast.success(`Farmer ${variables.status === 'approved' ? 'approved' : variables.status}`)
    },
    onError: () => toast.error('Failed to update farmer status.'),
  })
}

export function useDeleteFarmer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (farmerId) => deleteFarmer(farmerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FARMERS] })
      toast.success('Farmer removed')
    },
    onError: () => toast.error('Failed to remove farmer.'),
  })
}