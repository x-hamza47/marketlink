import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { announcementSchema } from '@/schemas/announcementSchema'
import { useCreateAnnouncement, useUpdateAnnouncement } from '@/features/admin/useAnnouncements'
import { cn } from '@/lib/utils'

const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'Everyone' },
  { value: 'farmers', label: 'Farmers' },
  { value: 'customers', label: 'Customers' },
  { value: 'admins', label: 'Admins' },
]

export default function AddAnnouncementModal({ open, onClose, announcement = null }) {
  const isEditMode = !!announcement

  const createAnnouncementMutation = useCreateAnnouncement()
  const updateAnnouncementMutation = useUpdateAnnouncement()
  const isPending = createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      message: '',
      audience: 'all',
      status: 'published',
      expiresAt: '',
    },
  })

  // Populate the form when opening in edit mode, or reset when opening to add.
  useEffect(() => {
    if (!open) return

    if (isEditMode) {
      reset({
        title: announcement.title,
        message: announcement.message,
        audience: announcement.audience,
        status: announcement.status,
        expiresAt: announcement.expiresAt ? announcement.expiresAt.slice(0, 10) : '',
      })
    } else {
      reset({ title: '', message: '', audience: 'all', status: 'published', expiresAt: '' })
    }
  }, [open, isEditMode, announcement, reset])

  function onValid(data) {
    const payload = {
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
    }

    if (isEditMode) {
      updateAnnouncementMutation.mutate(
        { announcementId: announcement.id, announcementData: payload },
        { onSuccess: handleClose }
      )
    } else {
      createAnnouncementMutation.mutate(payload, { onSuccess: handleClose })
    }
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={isEditMode ? 'Edit Announcement' : 'New Announcement'} size="lg">
      <form onSubmit={handleSubmit(onValid)} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Title <span className="text-error">*</span>
          </label>
          <input
            {...register('title')}
            type="text"
            placeholder="e.g. Eid Holidays — Market Closures"
            className={cn(
              'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
              errors.title ? 'border-error' : 'border-line focus:border-forest'
            )}
          />
          {errors.title && <p className="text-xs text-error mt-1">{errors.title.message}</p>}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Message <span className="text-error">*</span>
          </label>
          <textarea
            {...register('message')}
            rows={4}
            placeholder="Write the announcement details…"
            className={cn(
              'w-full px-3 py-2 rounded-md border bg-surface-cream text-sm outline-none resize-none',
              errors.message ? 'border-error' : 'border-line focus:border-forest'
            )}
          />
          {errors.message && <p className="text-xs text-error mt-1">{errors.message.message}</p>}
        </div>

        {/* Audience */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Audience <span className="text-error">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {AUDIENCE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('audience', option.value, { shouldValidate: true })}
                className={cn(
                  'px-3 py-1.5 rounded-md border text-xs font-medium transition-colors',
                  watch('audience') === option.value
                    ? 'bg-forest text-white border-forest'
                    : 'bg-surface-cream text-text-secondary border-line hover:border-forest/40'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.audience && <p className="text-xs text-error mt-1">{errors.audience.message}</p>}
        </div>

        {/* Status + Expiry, side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              Status <span className="text-error">*</span>
            </label>
            <div className="flex gap-2">
              {['published', 'draft'].map((statusOption) => (
                <button
                  key={statusOption}
                  type="button"
                  onClick={() => setValue('status', statusOption, { shouldValidate: true })}
                  className={cn(
                    'px-3 py-1.5 rounded-md border text-xs font-medium capitalize transition-colors',
                    watch('status') === statusOption
                      ? 'bg-forest text-white border-forest'
                      : 'bg-surface-cream text-text-secondary border-line hover:border-forest/40'
                  )}
                >
                  {statusOption}
                </button>
              ))}
            </div>
            {errors.status && <p className="text-xs text-error mt-1">{errors.status.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              Expires On <span className="text-text-secondary font-normal">(optional)</span>
            </label>
            <input
              {...register('expiresAt')}
              type="date"
              className={cn(
                'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
                errors.expiresAt ? 'border-error' : 'border-line focus:border-forest'
              )}
            />
            {errors.expiresAt && <p className="text-xs text-error mt-1">{errors.expiresAt.message}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-line/60">
          <Button type="button" variant="secondary" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? (isEditMode ? 'Saving…' : 'Creating…') : isEditMode ? 'Save Changes' : 'Publish'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}