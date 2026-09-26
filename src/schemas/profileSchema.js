import { z } from 'zod'

const MAX_IMAGE_SIZE_MB = 5
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const avatarFileSchema = z
  .instanceof(File, { message: 'Please select an image' })
  .refine((file) => file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024, {
    message: `Image must be under ${MAX_IMAGE_SIZE_MB}MB`,
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: 'Image must be JPG, PNG, or WEBP',
  })

// ---------- Profile info ----------
// Same core fields for every role (Admin / Farmer / Customer). Role-specific
// extras (e.g. a Farmer's stall name) can be added separately in the page
// if/when needed — this schema only covers what's common to all users.
export const profileInfoSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be under 60 characters'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),

  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9+\-\s()]{7,20}$/, 'Enter a valid phone number'),

  avatar: z
    .union([avatarFileSchema, z.null(), z.undefined()])
    .optional(),
})

// ---------- Change password ----------
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include at least one uppercase letter')
      .regex(/[0-9]/, 'Must include at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })