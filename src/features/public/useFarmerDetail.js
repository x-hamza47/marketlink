import { useQuery } from '@tanstack/react-query'
import { getFarmerProfile, getFarmerProductsList } from '@/services/publicService'

export function useFarmerProfile(farmerId) {
  return useQuery({
    queryKey: ['farmerProfile', farmerId],
    queryFn: () => getFarmerProfile(farmerId),
    enabled: !!farmerId,
  })
}

export function useFarmerProductsList(farmerId) {
  return useQuery({
    queryKey: ['farmerProducts', farmerId],
    queryFn: () => getFarmerProductsList(farmerId),
    enabled: !!farmerId,
  })
}