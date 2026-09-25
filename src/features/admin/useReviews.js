import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReviews,
  getReviewStats,
  updateReviewStatus,
  deleteReview,
} from "@/services/adminService";
import { QUERY_KEYS } from "@/lib/constants";
import { toast } from "sonner";

// ---------- Queries ----------

export function useReviews() {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS],
    queryFn: getReviews,
  });
}

export function useReviewStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS, "stats"],
    queryFn: getReviewStats,
  });
}

// ---------- Mutations ----------

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS] });
      toast.success("Review removed");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to remove review.");
    },
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, status }) => updateReviewStatus(reviewId, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS] })
      toast.success(variables.status === 'hidden' ? 'Review hidden' : 'Review made visible')
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update review status.')
    },
  })
}
