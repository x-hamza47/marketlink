import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, CheckCircle2 } from 'lucide-react'
import { registerSchema } from '@/schemas/authSchema'
import { registerCustomerRequest } from '@/services/authService'
import { toast } from 'sonner'

export default function CustomerRegisterForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const { confirmPassword, ...payload } = data
      await registerCustomerRequest(payload)
      setIsSubmitting(false)
      setSuccess(true)
      toast.success('Account created!')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setIsSubmitting(false)
      const message = err.response?.data?.message || 'Registration failed. Try again.'
      toast.error(message)
    }
  }

  if (success) {
    return (
      <div className="text-center bg-surface-cream border border-line rounded-3xl p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-forest mx-auto mb-4">
          <CheckCircle2 size={28} />
        </span>
        <h2 className="font-display text-xl font-semibold text-text-main mb-2">
          Account created
        </h2>
        <p className="text-sm text-text-secondary">Redirecting you to sign in...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-text-main mb-1.5">Full name</label>
        <div className="relative">
          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            placeholder="Ahmed Khan"
            {...register('name')}
            className={`w-full rounded-xl border bg-surface-cream pl-10 pr-4 py-2.5 text-sm outline-none transition-colors ${
              errors.name ? 'border-error focus:border-error' : 'border-line focus:border-forest'
            }`}
          />
        </div>
        {errors.name && <p className="text-error text-xs mt-1.5">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-main mb-1.5">Email address</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={`w-full rounded-xl border bg-surface-cream pl-10 pr-4 py-2.5 text-sm outline-none transition-colors ${
              errors.email ? 'border-error focus:border-error' : 'border-line focus:border-forest'
            }`}
          />
        </div>
        {errors.email && <p className="text-error text-xs mt-1.5">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-text-main mb-1.5">Phone</label>
          <div className="relative">
            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              placeholder="0300-1234567"
              {...register('phone')}
              className={`w-full rounded-xl border bg-surface-cream pl-10 pr-3 py-2.5 text-sm outline-none transition-colors ${
                errors.phone ? 'border-error focus:border-error' : 'border-line focus:border-forest'
              }`}
            />
          </div>
          {errors.phone && <p className="text-error text-xs mt-1.5">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-main mb-1.5">Address</label>
          <div className="relative">
            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              placeholder="Karachi"
              {...register('address')}
              className={`w-full rounded-xl border bg-surface-cream pl-10 pr-3 py-2.5 text-sm outline-none transition-colors ${
                errors.address ? 'border-error focus:border-error' : 'border-line focus:border-forest'
              }`}
            />
          </div>
          {errors.address && <p className="text-error text-xs mt-1.5">{errors.address.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-text-main mb-1.5">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className={`w-full rounded-xl border bg-surface-cream pl-10 pr-9 py-2.5 text-sm outline-none transition-colors ${
                errors.password ? 'border-error focus:border-error' : 'border-line focus:border-forest'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {errors.password && <p className="text-error text-xs mt-1.5">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-main mb-1.5">Confirm</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('confirmPassword')}
            className={`w-full rounded-xl border bg-surface-cream px-3.5 py-2.5 text-sm outline-none transition-colors ${
              errors.confirmPassword ? 'border-error focus:border-error' : 'border-line focus:border-forest'
            }`}
          />
          {errors.confirmPassword && <p className="text-error text-xs mt-1.5">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-forest py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors disabled:opacity-60 mt-2"
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}