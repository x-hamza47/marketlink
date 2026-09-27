import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sprout, Eye, EyeOff, Mail, Lock, User, Phone, MapPin, CheckCircle2 } from 'lucide-react'
import { registerSchema } from '@/schemas/authSchema'
import { toast } from 'sonner'
import clsx from 'clsx'

const PERKS = [
  'Browse fresh weekly stock',
  'Pre-order for pickup at market',
  'Save favorite farmers & products',
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'customer' },
  })

  const role = watch('role')

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    // --- LIVE API CALL (once backend exists) ---
    // const { confirmPassword, ...payload } = data
    // await registerRequest(payload)

    // --- STATIC MOCK ---
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSubmitting(false)
    setSuccess(true)
    toast.success('Account created!')
    setTimeout(() => navigate('/login'), 1500)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-bg-ivory flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center bg-surface-cream border border-line rounded-3xl p-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-forest mx-auto mb-4">
            <CheckCircle2 size={28} />
          </span>
          <h2 className="font-display text-xl font-semibold text-text-main mb-2">
            Account created
          </h2>
          <p className="text-sm text-text-secondary">Redirecting you to sign in...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-ivory flex">
      {/* Left — visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-charcoal items-center justify-center p-16">
        <div className="absolute top-0 left-0 w-96 h-96 bg-forest rounded-full blur-3xl opacity-40 -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-forest-light rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-md text-white">
          <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-amber mb-6">
            Join the movement
          </span>
          <h2 className="font-display text-4xl font-semibold leading-tight mb-5">
            Join the<br />local food movement.
          </h2>
          <p className="text-warm-cream/80 leading-relaxed mb-10 text-sm">
            Create your free account to pre-order from local farmers, save
            favorite markets, and get the freshest produce each week.
          </p>

          <ul className="space-y-3.5">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm text-warm-cream/90">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-light/40 text-amber">
                  <CheckCircle2 size={13} />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-white">
              <Sprout size={18} />
            </span>
            <span className="font-display text-lg font-semibold text-text-main">MarketLink</span>
          </Link>

          <h1 className="font-display text-3xl font-semibold text-text-main mb-2">
            Create account
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            Join MarketLink in less than a minute.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="block text-xs font-semibold text-text-main mb-2">
                I'm signing up as
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['customer', 'farmer'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setValue('role', r)}
                    className={clsx(
                      'rounded-xl border-2 py-2.5 text-sm font-semibold capitalize transition-colors',
                      role === r
                        ? 'border-forest bg-forest/10 text-forest'
                        : 'border-line text-text-secondary hover:border-forest/40'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

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

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-forest hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}