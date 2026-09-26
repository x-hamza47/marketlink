import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import Surface from '@/components/ui/Surface'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { profileInfoSchema, changePasswordSchema } from '@/schemas/profileSchema'
import { useProfile, useUpdateProfile, useChangePassword } from '@/features/admin/useProfile'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

function SectionSkeleton() {
  return (
    <Surface className="p-6 animate-pulse space-y-4">
      <div className="h-5 w-32 bg-line rounded" />
      <div className="h-10 w-full bg-line rounded" />
      <div className="h-10 w-full bg-line rounded" />
    </Surface>
  )
}

function ProfileInfoForm() {
  const { data: profile, isLoading } = useProfile()
  const updateProfileMutation = useUpdateProfile()
  const login = useAuthStore((state) => state.login)
  const user = useAuthStore((state) => state.user)

  const fileInputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: { name: '', email: '', phone: '', avatar: undefined },
  })

  const avatarValue = watch('avatar')

  useEffect(() => {
    if (profile) {
      reset({ name: profile.name, email: profile.email, phone: profile.phone, avatar: undefined })
      setPreviewUrl(profile.avatarUrl || null)
    }
  }, [profile, reset])

  useEffect(() => {
    if (avatarValue instanceof File) {
      const url = URL.createObjectURL(avatarValue)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [avatarValue])

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) setValue('avatar', file, { shouldValidate: true })
  }

  function onValid(data) {
    updateProfileMutation.mutate(data, {
      onSuccess: (updated) => {
        login({ ...user, ...updated })
      },
    })
  }

  if (isLoading) return <SectionSkeleton />

  return (
    <Surface className="p-6">
      <h2 className="font-display text-lg font-medium text-text-main mb-1">Profile Information</h2>
      <p className="text-xs text-text-secondary mb-5">Update your photo and personal details.</p>

      <form onSubmit={handleSubmit(onValid)} className="space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar preview"
                className="w-16 h-16 rounded-full object-cover border border-line"
              />
            ) : (
              <Avatar name={profile?.name} size="lg" />
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="profile-avatar-input"
            />
            <label
              htmlFor="profile-avatar-input"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-line text-xs font-medium text-text-secondary hover:border-forest/40 hover:text-forest cursor-pointer transition-colors"
            >
              <ImagePlus className="w-3.5 h-3.5" strokeWidth={1.75} />
              Change Photo
            </label>
            {errors.avatar && <p className="text-xs text-error mt-1.5">{errors.avatar.message}</p>}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Full Name <span className="text-error">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            className={cn(
              'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
              errors.name ? 'border-error' : 'border-line focus:border-forest'
            )}
          />
          {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              Email <span className="text-error">*</span>
            </label>
            <input
              {...register('email')}
              type="email"
              className={cn(
                'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
                errors.email ? 'border-error' : 'border-line focus:border-forest'
              )}
            />
            {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              Phone <span className="text-error">*</span>
            </label>
            <input
              {...register('phone')}
              type="text"
              placeholder="03xx-xxxxxxx"
              className={cn(
                'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
                errors.phone ? 'border-error' : 'border-line focus:border-forest'
              )}
            />
            {errors.phone && <p className="text-xs text-error mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-line/60">
          <Button type="submit" size="sm" disabled={updateProfileMutation.isPending}>
            {updateProfileMutation.isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Surface>
  )
}

function ChangePasswordForm() {
  const changePasswordMutation = useChangePassword()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  function onValid(data) {
    changePasswordMutation.mutate(data, { onSuccess: () => reset() })
  }

  return (
    <Surface className="p-6">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-4.5 h-4.5 text-forest" strokeWidth={1.75} />
        <h2 className="font-display text-lg font-medium text-text-main">Change Password</h2>
      </div>
      <p className="text-xs text-text-secondary mb-5">
        Use at least 8 characters, including an uppercase letter and a number.
      </p>

      <form onSubmit={handleSubmit(onValid)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Current Password <span className="text-error">*</span>
          </label>
          <div className="relative">
            <input
              {...register('currentPassword')}
              type={showCurrent ? 'text' : 'password'}
              className={cn(
                'w-full h-10 px-3 pr-10 rounded-md border bg-surface-cream text-sm outline-none',
                errors.currentPassword ? 'border-error' : 'border-line focus:border-forest'
              )}
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-xs text-error mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              New Password <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                {...register('newPassword')}
                type={showNew ? 'text' : 'password'}
                className={cn(
                  'w-full h-10 px-3 pr-10 rounded-md border bg-surface-cream text-sm outline-none',
                  errors.newPassword ? 'border-error' : 'border-line focus:border-forest'
                )}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                aria-label={showNew ? 'Hide password' : 'Show password'}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-xs text-error mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              Confirm New Password <span className="text-error">*</span>
            </label>
            <input
              {...register('confirmPassword')}
              type={showNew ? 'text' : 'password'}
              className={cn(
                'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
                errors.confirmPassword ? 'border-error' : 'border-line focus:border-forest'
              )}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-error mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-line/60">
          <Button type="submit" size="sm" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? 'Updating…' : 'Update Password'}
          </Button>
        </div>
      </form>
    </Surface>
  )
}

export default function ProfilePage() {
  return (
    <div className="max-w-3xl space-y-6">
      <ProfileInfoForm />
      <ChangePasswordForm />
    </div>
  )
}