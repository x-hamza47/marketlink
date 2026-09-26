import { z } from 'zod'

const baseAnnouncementFields = {
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(150, 'Title must be under 150 characters'),

  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be under 1000 characters'),

  audience: z.enum(['all', 'farmers', 'customers', 'admins'], {
    errorMap: () => ({ message: 'Select an audience' }),
  }),

  status: z.enum(['published', 'draft'], {
    errorMap: () => ({ message: 'Select a status' }),
  }),
}

// expiresAt is optional — either a valid date string/null, since not every
// announcement needs an auto-expiry (e.g. policy updates vs. holiday notices).
export const announcementSchema = z.object({
  ...baseAnnouncementFields,
  expiresAt: z
    .union([z.string().min(1), z.null(), z.undefined()])
    .optional(),
})