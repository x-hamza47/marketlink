import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, X } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { addCategorySchema, editCategorySchema } from '@/schemas/categorySchema'
import { useCreateCategory, useUpdateCategory } from '@/features/admin/useCategories'
import { cn } from '@/lib/utils'

export default function AddCategoryModal({ open, onClose, category = null }) {
  const isEditMode = !!category

  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()
  const isPending = createCategoryMutation.isPending || updateCategoryMutation.isPending

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
    resolver: zodResolver(isEditMode ? editCategorySchema : addCategorySchema),
    defaultValues: {
      name: '',
      status: 'active',
      image: undefined,
    },
  })

  const imageValue = watch('image')

  // Populate the form when opening in edit mode, or reset when opening to add.
  useEffect(() => {
    if (!open) return

    if (isEditMode) {
      reset({ name: category.name, status: category.status, image: undefined })
      setPreviewUrl(category.image || null)
    } else {
      reset({ name: '', status: 'active', image: undefined })
      setPreviewUrl(null)
    }
  }, [open, isEditMode, category, reset])

  // Generate/revoke an object URL preview whenever a new file is picked.
  useEffect(() => {
    if (imageValue instanceof File) {
      const url = URL.createObjectURL(imageValue)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [imageValue])

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      setValue('image', file, { shouldValidate: true })
    }
  }

  function handleRemoveImage() {
    setValue('image', isEditMode ? null : undefined, { shouldValidate: true })
    setPreviewUrl(isEditMode ? null : null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function onValid(data) {
    if (isEditMode) {
      updateCategoryMutation.mutate(
        { categoryId: category.id, categoryData: data },
        { onSuccess: handleClose }
      )
    } else {
      createCategoryMutation.mutate(data, { onSuccess: handleClose })
    }
  }

  function handleClose() {
    reset()
    setPreviewUrl(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={isEditMode ? 'Edit Category' : 'Add Category'} size="md">
      <form onSubmit={handleSubmit(onValid)} className="space-y-5">
        {/* Category name */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Category Name <span className="text-error">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="e.g. Vegetables"
            className={cn(
              'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
              errors.name ? 'border-error' : 'border-line focus:border-forest'
            )}
          />
          {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Status <span className="text-error">*</span>
          </label>
          <div className="flex gap-2">
            {['active', 'inactive'].map((statusOption) => (
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

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Category Image {!isEditMode && <span className="text-error">*</span>}
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            id="category-image-input"
          />

          {previewUrl ? (
            <div className="relative w-32 h-32 rounded-md overflow-hidden border border-line group">
              <img src={previewUrl} alt="Category preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="category-image-input"
              className={cn(
                'flex flex-col items-center justify-center gap-1.5 w-32 h-32 rounded-md border border-dashed cursor-pointer transition-colors',
                errors.image
                  ? 'border-error text-error'
                  : 'border-line text-text-secondary hover:border-forest/40 hover:text-forest'
              )}
            >
              <ImagePlus className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-xs font-medium">Upload image</span>
            </label>
          )}

          {isEditMode && !previewUrl && (
            <p className="text-xs text-text-secondary mt-1.5">
              Leave empty to keep no image, or upload a new one.
            </p>
          )}
          {errors.image && <p className="text-xs text-error mt-1">{errors.image.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-line/60">
          <Button type="button" variant="secondary" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? (isEditMode ? 'Saving…' : 'Creating…') : isEditMode ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}