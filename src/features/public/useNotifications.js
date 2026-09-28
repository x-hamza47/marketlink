import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/services/notificationService'
import { useAuthStore } from '@/stores/authStore'

const KEY = 'notifications'

export function useNotifications() {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: [KEY],
    queryFn: getNotifications,
    enabled: !!isAuthenticated,
    refetchInterval: 30000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] })
    },
  })
}
