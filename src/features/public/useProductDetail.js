import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProductById, getProductReviews, addProductReview, getRelatedProducts } from '@/services/publicService'
import { toast } from 'sonner'

export function useProductDetail(productId) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  })
}

export function useProductReviews(productId) {
  return useQuery({
    queryKey: ['productReviews', productId],
    queryFn: () => getProductReviews(productId),
    enabled: !!productId,
  })
}

export function useRelatedProducts(productId, category) {
  return useQuery({
    queryKey: ['relatedProducts', productId, category],
    queryFn: () => getRelatedProducts(productId, category),
    enabled: !!category,
  })
}

export function useAddProductReview(productId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reviewData) => addProductReview(productId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReviews', productId] })
      toast.success('Review added!')
    },
    onError: () => toast.error('Could not submit review. Try again.'),
  })
}