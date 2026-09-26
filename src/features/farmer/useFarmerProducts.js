import { useQuery } from '@tanstack/react-query'
import {
  getFarmerProducts,
  getFarmerProductStats,
  createFarmerProduct,
  updateFarmerProduct,
  updateFarmerProductAvailability,
  deleteFarmerProduct,
} from '@/services/farmerService'
import { useAdminMutation } from '@/hooks/useAdminMutation'

const KEY = 'farmer-products'

export function useFarmerProducts() {
  return useQuery({ queryKey: [KEY], queryFn: getFarmerProducts })
}

export function useFarmerProductStats() {
  return useQuery({ queryKey: [KEY, 'stats'], queryFn: getFarmerProductStats })
}

export function useCreateFarmerProduct() {
  return useAdminMutation({
    mutationFn: createFarmerProduct,
    queryKey: KEY,
    successMessage: 'Product added',
    errorMessage: 'Failed to add product.',
  })
}

export function useUpdateFarmerProduct() {
  return useAdminMutation({
    mutationFn: ({ productId, productData }) => updateFarmerProduct(productId, productData),
    queryKey: KEY,
    successMessage: 'Product updated',
    errorMessage: 'Failed to update product.',
  })
}

export function useUpdateFarmerProductAvailability() {
  return useAdminMutation({
    mutationFn: ({ productId, availability }) => updateFarmerProductAvailability(productId, availability),
    queryKey: KEY,
    getSuccessMessage: ({ availability }) => `Marked as ${availability.replace('_', ' ')}`,
    errorMessage: 'Failed to update availability.',
  })
}

export function useDeleteFarmerProduct() {
  return useAdminMutation({
    mutationFn: deleteFarmerProduct,
    queryKey: KEY,
    successMessage: 'Product removed',
    errorMessage: 'Failed to remove product.',
  })
}