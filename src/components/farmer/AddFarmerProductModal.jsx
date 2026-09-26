import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, X } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { addFarmerProductSchema, editFarmerProductSchema, CATEGORY_OPTIONS } from '@/schemas/farmerProductSchema'
import { useCreateFarmerProduct, useUpdateFarmerProduct } from '@/features/farmer/useFarmerProducts'
import { cn } from '@/lib/utils'

export default function AddFarmerProductModal({ open, onClose, product = null }) {
  const isEditMode = !!product

  const createProductMutation = useCreateFarmerProduct()
  const updateProductMutation = useUpdateFarmerProduct()
  const isPending = createProductMutation.isPending || updateProductMutation.isPending

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
    resolver: zodResolver(isEditMode ? editFarmerProductSchema : addFarmerProductSchema),
    defaultValues: {
      name: '',
      category: CATEGORY_OPTIONS[0],
      price: '',
      unit: '',
      stock: '',
      description: '',
      image: undefined,
    },
  })

  const imageValue = watch('image')

  useEffect(() => {
    if (!open) return

    if (isEditMode) {
      reset({
        name: product.name,
        category: product.category,
        price: product.price,
        unit: product.unit,
        stock: product.stock,
        description: product.description || '',
        image: undefined,
      })
      setPreviewUrl(product.image || null)
    } else {
      reset({
        name: '',
        category: CATEGORY_OPTIONS[0],
        price: '',
        unit: '',
        stock: '',
        description: '',
        image: undefined,
      })
      setPreviewUrl(null)
    }
  }, [open, isEditMode, product, reset])

  useEffect(() => {
    if (imageValue instanceof File) {
      const url = URL.createObjectURL(imageValue)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [imageValue])

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) setValue('image', file, { shouldValidate: true })
  }

  function handleRemoveImage() {
    setValue('image', isEditMode ? null : undefined, { shouldValidate: true })
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function onValid(data) {
    if (isEditMode) {
      updateProductMutation.mutate(
        { productId: product.id, productData: data },
        { onSuccess: handleClose }
      )
    } else {
      createProductMutation.mutate(data, { onSuccess: handleClose })
    }
  }

  function handleClose() {
    reset()
    setPreviewUrl(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={isEditMode ? 'Edit Product' : 'Add Product'} size="lg">
      <form onSubmit={handleSubmit(onValid)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Product Name <span className="text-error">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="e.g. Organic Tomatoes"
            className={cn(
              'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
              errors.name ? 'border-error' : 'border-line focus:border-forest'
            )}
          />
          {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Category <span className="text-error">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setValue('category', cat, { shouldValidate: true })}
                className={cn(
                  'px-3 py-1.5 rounded-md border text-xs font-medium transition-colors',
                  watch('category') === cat
                    ? 'bg-forest text-white border-forest'
                    : 'bg-surface-cream text-text-secondary border-line hover:border-forest/40'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          {errors.category && <p className="text-xs text-error mt-1">{errors.category.message}</p>}
        </div>

        {/* Price, Unit, Stock */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              Price (Rs.) <span className="text-error">*</span>
            </label>
            <input
              {...register('price')}
              type="number"
              step="0.01"
              placeholder="180"
              className={cn(
                'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
                errors.price ? 'border-error' : 'border-line focus:border-forest'
              )}
            />
            {errors.price && <p className="text-xs text-error mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              Unit <span className="text-error">*</span>
            </label>
            <input
              {...register('unit')}
              type="text"
              placeholder="kg, dozen, bunch…"
              className={cn(
                'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
                errors.unit ? 'border-error' : 'border-line focus:border-forest'
              )}
            />
            {errors.unit && <p className="text-xs text-error mt-1">{errors.unit.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              Stock Qty <span className="text-error">*</span>
            </label>
            <input
              {...register('stock')}
              type="number"
              placeholder="42"
              className={cn(
                'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
                errors.stock ? 'border-error' : 'border-line focus:border-forest'
              )}
            />
            {errors.stock && <p className="text-xs text-error mt-1">{errors.stock.message}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Description <span className="text-text-secondary font-normal">(optional)</span>
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Freshness notes, growing method, harvest schedule…"
            className={cn(
              'w-full px-3 py-2 rounded-md border bg-surface-cream text-sm outline-none resize-none',
              errors.description ? 'border-error' : 'border-line focus:border-forest'
            )}
          />
          {errors.description && <p className="text-xs text-error mt-1">{errors.description.message}</p>}
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Product Image {!isEditMode && <span className="text-error">*</span>}
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            id="product-image-input"
          />

          {previewUrl ? (
            <div className="relative w-32 h-32 rounded-md overflow-hidden border border-line group">
              <img src={previewUrl} alt="Product preview" className="w-full h-full object-cover" />
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
              htmlFor="product-image-input"
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
          {errors.image && <p className="text-xs text-error mt-1">{errors.image.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-line/60">
          <Button type="button" variant="secondary" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? (isEditMode ? 'Saving…' : 'Adding…') : isEditMode ? 'Save Changes' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}