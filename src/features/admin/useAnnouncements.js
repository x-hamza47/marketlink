import { useQuery } from '@tanstack/react-query'
import {
  getAnnouncements,
  getAnnouncementStats,
  createAnnouncement,
  updateAnnouncement,
  updateAnnouncementStatus,
  deleteAnnouncement,
} from '@/services/adminService'
import { QUERY_KEYS } from '@/lib/constants'
import { useAdminMutation } from '@/hooks/useAdminMutation'

// ---------- Queries ----------

export function useAnnouncements() {
  return useQuery({
    queryKey: [QUERY_KEYS.ANNOUNCEMENTS],
    queryFn: getAnnouncements,
  })
}

export function useAnnouncementStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.ANNOUNCEMENTS, 'stats'],
    queryFn: getAnnouncementStats,
  })
}

// ---------- Mutations ----------

export function useCreateAnnouncement() {
  return useAdminMutation({
    mutationFn: createAnnouncement,
    queryKey: QUERY_KEYS.ANNOUNCEMENTS,
    successMessage: 'Announcement created',
    errorMessage: 'Failed to create announcement.',
  })
}

export function useUpdateAnnouncement() {
  return useAdminMutation({
    mutationFn: ({ announcementId, announcementData }) =>
      updateAnnouncement(announcementId, announcementData),
    queryKey: QUERY_KEYS.ANNOUNCEMENTS,
    successMessage: 'Announcement updated',
    errorMessage: 'Failed to update announcement.',
  })
}

export function useUpdateAnnouncementStatus() {
  return useAdminMutation({
    mutationFn: ({ announcementId, status }) =>
      updateAnnouncementStatus(announcementId, status),
    queryKey: QUERY_KEYS.ANNOUNCEMENTS,
    getSuccessMessage: ({ status }) =>
      status === 'published' ? 'Announcement published' : 'Moved to drafts',
    errorMessage: 'Failed to update announcement status.',
  })
}

export function useDeleteAnnouncement() {
  return useAdminMutation({
    mutationFn: deleteAnnouncement,
    queryKey: QUERY_KEYS.ANNOUNCEMENTS,
    successMessage: 'Announcement removed',
    errorMessage: 'Failed to remove announcement.',
  })
}