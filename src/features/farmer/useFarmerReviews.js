import { useQuery } from '@tanstack/react-query'
import { getFarmerReviews, getFarmerReviewStats, respondToReview } from '@/services/farmerService'
import { useAdminMutation } from '@/hooks/useAdminMutation'

const KEY = 'farmer-reviews'

export function useFarmerReviews() {
  return useQuery({ queryKey: [KEY], queryFn: getFarmerReviews })
}

export function useFarmerReviewStats() {
  return useQuery({ queryKey: [KEY, 'stats'], queryFn: getFarmerReviewStats })
}

export function useRespondToReview() {
  return useAdminMutation({
    mutationFn: ({ reviewId, response }) => respondToReview(reviewId, response),
    queryKey: KEY,
    successMessage: 'Response posted',
    errorMessage: 'Failed to post response.',
  })
}