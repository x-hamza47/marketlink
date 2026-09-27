import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

export function useRequireAuth() {
  const { isAuthenticated } = useAuthStore()

  return function requireAuth(action) {
    return (...args) => {
      if (!isAuthenticated) {
        toast.error('Please log in to continue', {
          description: 'Create an account or log in to save favorites and add items to your cart.',
        })
        return
      }
      action(...args)
    }
  }
}