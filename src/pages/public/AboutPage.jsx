import { Link } from 'react-router-dom'
import { Sprout, MapPin, ShoppingBasket, Clock, CheckCircle2, Store, Users, ArrowRight } from 'lucide-react'

const CUSTOMER_STEPS = [
  {
    icon: MapPin,
    title: 'Find a market near you',
    description: 'Browse farmers markets around you by distance, day, or search — see exactly when and where they run.',
  },
  {
    icon: ShoppingBasket,
    title: 'Pre-order fresh stock',
    description: 'Browse what local farmers have listed for the week and add what you want to your basket.',
  },
  {
    icon: Clock,
    title: 'Pick up at your slot',
    description: 'Each farmer sets a pickup window and order cutoff — show up, collect your order, done.',
  },
]

const FARMER_STEPS = [
  {
    icon: Store,
    title: 'Set up your stall',
    description: 'Register your stall, list the markets you sell at, and set your pickup days and cutoff times.',
  },
  {
    icon: CheckCircle2,
    title: 'Get approved',
    description: 'New farmer accounts are reviewed by our team before going live, to keep every stall on MarketLink genuine.',
  },
  {
    icon: Users,
    title: 'Sell to your community',
    description: 'List your weekly stock, manage incoming orders, and build a customer base at markets you already attend.',
  },
]

const VALUES = [
  {
    title: 'Local by design',
    description: 'Every market and every stall on MarketLink is a real, physical market — we\'re a way to find and plan around them, not a replacement for them.',
  },
  {
    title: 'Less waste, less guessing',
    description: 'Pre-ordering means farmers bring what\'s actually been asked for, and customers know what\'s available before they show up.',
  },
  {
    title: 'Built for both sides',
    description: 'Simple tools for farmers to manage their stock and schedule, and a simple way for customers to discover what\'s fresh nearby.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-bg-ivory min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-charcoal">
        <div className="absolute top-0 left-0 w-96 h-96 bg-forest rounded-full blur-3xl opacity-40 -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-forest-light rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-amber mb-6">
            <Sprout size={14} />
            About MarketLink
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white mb-5 leading-tight">
            Connecting local farmers<br />with the people nearby.
          </h1>
          <p className="text-warm-cream/80 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            MarketLink helps you find farmers markets around you, pre-order fresh
            produce from the farmers who sell there, and pick it up on your schedule.
          </p>
        </div>
      </div>

      {/* For customers */}
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-wide text-forest uppercase mb-3">
            For Customers
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-main mb-3">
            How shopping works
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-lg mx-auto">
            Three steps between you and fresh, local produce.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CUSTOMER_STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-3xl border border-line bg-surface-cream p-6 shadow-soft relative"
            >
              <span className="absolute top-6 right-6 font-display text-3xl font-semibold text-line-soft">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest/10 text-forest mb-4">
                <step.icon size={20} />
              </span>
              <h3 className="font-display text-lg font-semibold text-text-main mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* For farmers */}
      <div className="bg-surface-sand py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold tracking-wide text-forest uppercase mb-3">
              For Farmers
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-main mb-3">
              How selling works
            </h2>
            <p className="text-text-secondary text-sm sm:text-base max-w-lg mx-auto">
              Bring your stall online in three steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FARMER_STEPS.map((step, i) => (
              <div
                key={step.title}
                className="rounded-3xl border border-line bg-surface-cream p-6 shadow-soft relative"
              >
                <span className="absolute top-6 right-6 font-display text-3xl font-semibold text-line-soft">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber/15 text-amber-dark mb-4">
                  <step.icon size={20} />
                </span>
                <h3 className="font-display text-lg font-semibold text-text-main mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
            >
              Register your stall
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-wide text-forest uppercase mb-3">
            What We Believe
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-main mb-3">
            Why MarketLink exists
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {VALUES.map((value) => (
            <div key={value.title} className="text-center sm:text-left">
              <h3 className="font-display text-lg font-semibold text-text-main mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-charcoal">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-4">
            Ready to explore what's fresh near you?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              to="/markets"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
            >
              Find a Market
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}