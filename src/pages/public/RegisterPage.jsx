import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sprout, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'
import CustomerRegisterForm from '@/components/public/CustomerRegisterForm'
import FarmerRegisterForm from '@/components/public/FarmerRegisterForm'

const PERKS = [
  'Browse fresh weekly stock',
  'Pre-order for pickup at market',
  'Save favorite farmers & products',
]

export default function RegisterPage() {
  const [role, setRole] = useState('customer')

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
          <p className="text-sm text-text-secondary mb-6">
            Join MarketLink in less than a minute.
          </p>

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-text-main mb-2">
              I'm signing up as
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['customer', 'farmer'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
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

          {role === 'customer' ? <CustomerRegisterForm /> : <FarmerRegisterForm />}

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