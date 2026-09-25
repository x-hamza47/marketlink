import { useQuery } from '@tanstack/react-query'
import { getCategories, getCategoryStats, createCategory, updateCategory, updateCategoryStatus, deleteCategory } from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'
import { useAdminMutation } from '@/hooks/useAdminMutation'

// ---------- Queries ----------

export function useCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
  })
}

export function useCategoryStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, 'stats'],
    queryFn: getCategoryStats,
  })
}

// ---------- Mutations ----------

export function useCreateCategory() {
  return useAdminMutation({
    mutationFn: createCategory,
    queryKey: QUERY_KEYS.CATEGORIES,
    successMessage: 'Category created',
    errorMessage: 'Failed to create category.',
  })
}

export function useUpdateCategory() {
  return useAdminMutation({
    mutationFn: ({ categoryId, categoryData }) => updateCategory(categoryId, categoryData),
    queryKey: QUERY_KEYS.CATEGORIES,
    successMessage: 'Category updated',
    errorMessage: 'Failed to update category.',
  })
}

export function useUpdateCategoryStatus() {
  return useAdminMutation({
    mutationFn: ({ categoryId, status }) => updateCategoryStatus(categoryId, status),
    queryKey: QUERY_KEYS.CATEGORIES,
    getSuccessMessage: ({ status }) => `Category ${status === 'active' ? 'activated' : 'deactivated'}`,
    errorMessage: 'Failed to update category status.',
  })
}

export function useDeleteCategory() {
  return useAdminMutation({
    mutationFn: deleteCategory,
    queryKey: QUERY_KEYS.CATEGORIES,
    successMessage: 'Category removed',
    errorMessage: 'Failed to remove category.',
  })
}