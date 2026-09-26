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

const CATEGORY_OPTIONS = [
  'Vegetables',
  'Fruits',
  'Dairy & Eggs',
  'Herbs',
  'Baked Goods',
  'Honey & Preserves',
]

const baseProductFields = {
  name: z
    .string()
    .min(1, 'Product name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be under 60 characters'),

  category: z.enum(CATEGORY_OPTIONS, {
    errorMap: () => ({ message: 'Select a category' }),
  }),

  price: z.coerce
    .number({ invalid_type_error: 'Price is required' })
    .positive('Price must be greater than 0'),

  unit: z
    .string()
    .min(1, 'Unit is required')
    .max(20, 'Unit must be under 20 characters'),

  stock: z.coerce
    .number({ invalid_type_error: 'Stock quantity is required' })
    .int('Stock must be a whole number')
    .nonnegative('Stock cannot be negative'),

  description: z
    .string()
    .max(300, 'Description must be under 300 characters')
    .optional(),
}

export const addFarmerProductSchema = z.object({
  ...baseProductFields,
  image: imageFileSchema,
})

export const editFarmerProductSchema = z.object({
  ...baseProductFields,
  image: z.union([imageFileSchema, z.null(), z.undefined()]).optional(),
})

export { CATEGORY_OPTIONS }