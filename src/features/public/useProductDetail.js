import { useQuery } from '@tanstack/react-query'
import { getProductById, getProductReviews, getRelatedProducts } from '@/services/publicService'

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