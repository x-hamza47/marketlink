import { useQuery } from '@tanstack/react-query'
import { getProducts, getProductStats, updateProductModeration, deleteProduct } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'
import { useAdminMutation } from '@/hooks/useAdminMutation'

export function useProducts() {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS],
    queryFn: getProducts,
  })
}

export function useProductStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'stats'],
    queryFn: getProductStats,
  })
}

export function useUpdateProductModeration() {
  return useAdminMutation({
    mutationFn: ({ productId, moderation }) => updateProductModeration(productId, moderation),
    queryKey: QUERY_KEYS.PRODUCTS,
    getSuccessMessage: ({ moderation }) =>
      moderation === 'approved' ? 'Product approved'
      : moderation === 'rejected' ? 'Product rejected'
      : `Product marked ${moderation}`,
    errorMessage: 'Failed to update product moderation.',
  })
}

export function useDeleteProduct() {
  return useAdminMutation({
    mutationFn: deleteProduct,
    queryKey: QUERY_KEYS.PRODUCTS,
    successMessage: 'Product removed',
    errorMessage: 'Failed to remove product.',
  })
}