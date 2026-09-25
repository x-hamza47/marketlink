import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useAdminMutation({
  mutationFn,
  queryKey,
  successMessage,
  getSuccessMessage,
  errorMessage = 'Something went wrong.',
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      const message = getSuccessMessage ? getSuccessMessage(variables) : successMessage
      toast.success(message)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || errorMessage)
    },
  })
}