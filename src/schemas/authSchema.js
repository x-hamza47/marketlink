import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
})

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Full name is required'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    phone: z.string().min(1, 'Phone is required'),
    address: z.string().min(1, 'Address is required'),
    role: z.enum(['customer', 'farmer']),
    password: z.string().min(6, 'At least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const farmerMarketSchema = z
  .object({
    marketId: z.string().min(1, 'Select a market'),
    operatingDays: z.array(z.enum(DAYS)).min(1, 'Select at least one day'),
    pickupStart: z.string().min(1, 'Start time is required'),
    pickupEnd: z.string().min(1, 'End time is required'),
    cutoffHours: z.coerce.number().min(0, 'Must be 0 or more'),
  })
  .refine((data) => data.pickupStart < data.pickupEnd, {
    message: 'Start time must be before end time',
    path: ['pickupEnd'],
  })

export const farmerRegisterSchema = z
  .object({
    name: z.string().min(1, 'Full name is required'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    phone: z.string().min(1, 'Phone is required'),
    address: z.string().min(1, 'Address is required'),
    password: z.string().min(6, 'At least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm password'),

    stallName: z.string().min(1, 'Stall name is required'),
    contactPerson: z.string().min(1, 'Contact person is required'),
    description: z.string().optional(),

    markets: z.array(farmerMarketSchema).min(1, 'Add at least one market'),

    locationAddress: z.string().min(1, 'Stall address is required'),
    lat: z.number({ error: 'Pick a location' }),
    lng: z.number({ error: 'Pick a location' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const FARMER_STEP_FIELDS = [
  ['name', 'email', 'phone', 'address', 'password', 'confirmPassword'],
  ['stallName', 'contactPerson', 'description'],
  ['markets'],
  ['locationAddress', 'lat', 'lng'],
]

export const DAY_OPTIONS = DAYS