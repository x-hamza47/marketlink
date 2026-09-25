import { z } from 'zod'

export const marketSchema = z.object({
  name: z
    .string()
    .min(1, 'Market name is required')
    .min(3, 'Market name must be at least 3 characters'),

  address: z
    .string()
    .min(1, 'Please search or select a location on the map'),

  operatingDays: z
    .array(z.string())
    .min(1, 'Select at least one operating day'),

  lat: z
    .number({ invalid_type_error: 'Please select a location on the map' }),

  lng: z
    .number({ invalid_type_error: 'Please select a location on the map' }),
})