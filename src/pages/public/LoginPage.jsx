import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sprout, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { loginSchema } from '@/schemas/authSchema'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
import { loginRequest } from '@/services/authService'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    // --- LIVE API CALL (once backend exists) ---

    try {
      const { user, token } = await loginRequest(data);
      login(user, token);
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password.'
      toast.error(message)

    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-bg-ivory flex">
      <div className="flex-1 flex items-center justify-center px-6 py-14 sm:py-20">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-white">
              <Sprout size={18} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg font-semibold text-text-main">MarketLink</span>
              <span className="text-[11px] text-text-secondary -mt-1">eGreen Basket</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl font-semibold text-text-main mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            Sign in to browse fresh stock and manage your pre-orders.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-main mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className={`w-full rounded-xl border bg-surface-cream pl-10 pr-4 py-2.5 text-sm outline-none transition-colors ${errors.email ? 'border-error focus:border-error' : 'border-line focus:border-forest'
                    }`}
                />
              </div>
              {errors.email && <p className="text-error text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-text-main">Password</label>
                <a href="#" className="text-xs font-medium text-forest hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  className={`w-full rounded-xl border bg-surface-cream pl-10 pr-11 py-2.5 text-sm outline-none transition-colors ${errors.password ? 'border-error focus:border-error' : 'border-line focus:border-forest'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-error text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-forest py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors disabled:opacity-60 mt-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
              {!isSubmitting && <ArrowRight size={15} />}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-8">
            New to MarketLink?{' '}
            <Link to="/signup" className="font-semibold text-forest hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-charcoal items-center justify-center p-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-forest rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-forest-light rounded-full blur-3xl opacity-30 -translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-md text-white">
          <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-amber mb-6">
            Fresh. Local. Connected.
          </span>
          <h2 className="font-display text-4xl font-semibold leading-tight mb-5">
            Fresh food,<br />zero compromise.
          </h2>
          <p className="text-warm-cream/80 leading-relaxed mb-10 text-sm">
            Sign in to browse this week's harvest from farmers near you,
            pre-order your basket, and pick up at your local market.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="border-l-2 border-forest-light pl-4">
              <p className="text-2xl font-semibold">500+</p>
              <p className="text-xs text-warm-cream/60 uppercase tracking-wider mt-1 font-medium">Markets</p>
            </div>
            <div className="border-l-2 border-forest-light pl-4">
              <p className="text-2xl font-semibold">2,000+</p>
              <p className="text-xs text-warm-cream/60 uppercase tracking-wider mt-1 font-medium">Farmers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}