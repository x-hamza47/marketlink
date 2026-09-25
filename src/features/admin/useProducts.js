import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProducts,
  getProductStats,
  updateProductModeration,
  deleteProduct,
} from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'
import { toast } from 'sonner'


// ---------- Queries ----------

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


// ---------- Mutations ----------

export function useUpdateProductModeration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, moderation }) => updateProductModeration(productId, moderation),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] })
      toast.success(
        variables.moderation === 'approved'
          ? 'Product approved'
          : variables.moderation === 'rejected'
          ? 'Product rejected'
          : `Product marked ${variables.moderation}`
      )
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update product moderation.')
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] })
      toast.success('Product removed')
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to remove product.')
    },
  })
}