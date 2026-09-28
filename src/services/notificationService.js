import axiosClient from './axiosClient'

export async function getNotifications() {
  const { data } = await axiosClient.get('/notifications')
  return data.data || []
}

export async function markNotificationRead(id) {
  const { data } = await axiosClient.patch(`/notifications/${id}/read`)
  return data.data
}

export async function markAllNotificationsRead() {
  const { data } = await axiosClient.patch('/notifications/read-all')
  return data.data
}
