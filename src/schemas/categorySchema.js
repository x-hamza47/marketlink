import { z } from 'zod'

const MAX_IMAGE_SIZE_MB = 5
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const imageFileSchema = z
  .instanceof(File, { message: 'Please select an image' })
  .refine((file) => file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024, {
    message: `Image must be under ${MAX_IMAGE_SIZE_MB}MB`,
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: 'Image must be JPG, PNG, or WEBP',
  })

const baseCategoryFields = {
  name: z
    .string()
    .min(1, 'Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(40, 'Category name must be under 40 characters'),

  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: 'Select a status' }),
  }),
}

// Used when creating a new category — image is mandatory.
export const addCategorySchema = z.object({
  ...baseCategoryFields,
  image: imageFileSchema,
})

// Used when editing — image is optional (only validated if a new file is provided;
// leaving it untouched keeps the existing Cloudinary image on the backend).
export const editCategorySchema = z.object({
  ...baseCategoryFields,
  image: z
    .union([imageFileSchema, z.null(), z.undefined()])
    .optional(),
})