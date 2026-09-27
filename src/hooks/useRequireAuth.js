import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

/**
 * Wraps an action so it only runs if the user is logged in.
 * Otherwise shows a toast prompting login. Used for cart/favorite
 * actions on public pages that shouldn't work for guests.
 */
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