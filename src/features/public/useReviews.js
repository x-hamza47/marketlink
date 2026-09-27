import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProductReviews, getFarmerReviews, addReview } from '@/services/publicService'
import { toast } from 'sonner'

export function useProductReviews(productId) {
  return useQuery({
    queryKey: ['productReviews', productId],
    queryFn: () => getProductReviews(productId),
    enabled: !!productId,
  })
}

export function useFarmerReviews(farmerId) {
  return useQuery({
    queryKey: ['farmerReviews', farmerId],
    queryFn: () => getFarmerReviews(farmerId),
    enabled: !!farmerId,
  })
}

export function useAddReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerOrders'] })
      queryClient.invalidateQueries({ queryKey: ['productReviews'] })
      queryClient.invalidateQueries({ queryKey: ['farmerReviews'] })
      toast.success('Review posted')
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Could not post review'),
  })
}