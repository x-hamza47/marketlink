import { useQuery } from '@tanstack/react-query'
import { getReviews, getReviewStats, updateReviewStatus, deleteReview } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'
import { useAdminMutation } from '@/hooks/useAdminMutation'

export function useReviews() {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS],
    queryFn: getReviews,
  })
}

export function useReviewStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS, 'stats'],
    queryFn: getReviewStats,
  })
}

export function useDeleteReview() {
  return useAdminMutation({
    mutationFn: deleteReview,
    queryKey: QUERY_KEYS.REVIEWS,
    successMessage: 'Review removed',
    errorMessage: 'Failed to remove review.',
  })
}

export function useUpdateReviewStatus() {
  return useAdminMutation({
    mutationFn: ({ reviewId, status }) => updateReviewStatus(reviewId, status),
    queryKey: QUERY_KEYS.REVIEWS,
    getSuccessMessage: ({ status }) => (status === 'hidden' ? 'Review hidden' : 'Review made visible'),
    errorMessage: 'Failed to update review status.',
  })
}