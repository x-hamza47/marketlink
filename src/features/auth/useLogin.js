import { useMutation } from '@tanstack/react-query'
import { loginRequest } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'

export function useLogin() {
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      login(data.user, data.token) 
    },
  })
}