import { useQuery } from '@tanstack/react-query'
import { getProfile, updateProfile, changePassword } from '@/services/profileService'
import { useAdminMutation } from '@/hooks/useAdminMutation'
import { useAuthStore } from '@/stores/authStore'

const PROFILE_QUERY_KEY = 'profile'

// ---------- Query ----------

export function useProfile() {
  const userId = useAuthStore((state) => state.user?.id)

  return useQuery({
    queryKey: [PROFILE_QUERY_KEY, userId],
    queryFn: () => getProfile(userId),
    enabled: !!userId,
  })
}

// ---------- Mutations ----------

export function useUpdateProfile() {
  return useAdminMutation({
    mutationFn: updateProfile,
    queryKey: PROFILE_QUERY_KEY,
    successMessage: 'Profile updated',
    errorMessage: 'Failed to update profile.',
  })
}

export function useChangePassword() {
  return useAdminMutation({
    mutationFn: changePassword,
    queryKey: PROFILE_QUERY_KEY,
    successMessage: 'Password changed successfully',
    errorMessage: 'Failed to change password.',
  })
}