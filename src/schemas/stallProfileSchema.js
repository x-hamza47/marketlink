import { z } from 'zod'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const marketEntrySchema = z.object({
  id: z.string(),
  marketId: z.string().min(1, 'Select a market'),
  marketName: z.string(),
  operatingDays: z.array(z.enum(DAYS)).min(1, 'Select at least one operating day'),
  pickupStart: z.string().min(1, 'Pickup start time is required'),
  pickupEnd: z.string().min(1, 'Pickup end time is required'),
  cutoffHours: z.coerce
    .number({ invalid_type_error: 'Cutoff is required' })
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .max(48, 'Must be 48 hours or less'),
})

export const stallProfileSchema = z.object({
  stallName: z
    .string()
    .min(1, 'Stall name is required')
    .min(2, 'Stall name must be at least 2 characters')
    .max(80, 'Stall name must be under 80 characters'),

  description: z
    .string()
    .max(300, 'Description must be under 300 characters')
    .optional(),

  markets: z.array(marketEntrySchema).min(1, 'Add at least one market'),
})

export { DAYS }