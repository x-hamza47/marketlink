import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function RequireRole({ role }) {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== role) {

    const fallback =
      user?.role === 'farmer' ? '/farmer' :
      user?.role === 'admin' ? '/admin' :
      '/'
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}