import { Link } from 'react-router-dom'
import {
  Search, MapPin, ShoppingBasket, Clock, CheckCircle2,
  Store, ListChecks, PackageCheck, ArrowRight, Sprout
} from 'lucide-react'

const CUSTOMER_FLOW = [
  {
    icon: Search,
    title: 'Search or browse markets',
    description: 'Use your location, a market day, or a search term to find farmers markets near you — see hours, address, and how many farmers sell there.',
  },
  {
    icon: ShoppingBasket,
    title: 'Browse fresh stock',
    description: 'Open a market to see what its farmers have listed this week — filter by category, price, or search for something specific.',
  },
  {
    icon: ListChecks,
    title: 'Place your order',
    description: 'Add items to your basket and check out. Each order goes straight to the farmer selling it, tied to the market and pickup slot they\'ve set.',
  },
  {
    icon: Clock,
    title: 'Pick up before the cutoff',
    description: 'Every farmer sets an order cutoff time and a pickup window for each market day. Place your order before the cutoff, then collect it during that window.',
  },
]

const FARMER_FLOW = [
  {
    icon: Store,
    title: 'Register your stall',
    description: 'Sign up with your stall name, contact details, and the markets you sell at — including the days, pickup times, and order cutoff for each one.',
  },
  {
    icon: CheckCircle2,
    title: 'Wait for approval',
    description: 'New farmer accounts are reviewed before they go live. Once approved, you can log in and start managing your stall.',
  },
  {
    icon: PackageCheck,
    title: 'List your weekly stock',
    description: 'Add products with pricing, unit, and quantity available. Mark items unavailable when you sell out, so customers always see accurate stock.',
  },
  {
    icon: ListChecks,
    title: 'Fulfill orders at pickup',
    description: 'See incoming orders for each market day, and hand off orders to customers during your set pickup window.',
  },
]

function FlowStep({ step, index, accent }) {
  const isLast = false
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${accent === 'forest' ? 'bg-forest/10 text-forest' : 'bg-amber/15 text-amber-dark'
            }`}
        >
          <step.icon size={19} />
        </span>
        {!isLast && <span className="w-px flex-1 bg-line mt-2" />}
      </div>
      <div className="pb-10">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          Step {index + 1}
        </span>
        <h3 className="font-display text-lg font-semibold text-text-main mt-1 mb-2">
          {step.title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed max-w-md">
          {step.description}
        </p>
      </div>
    </div>
  )
}

export default function HowItWorksPage() {
  return (
    <div className="bg-bg-ivory min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-charcoal">
        <div className="absolute top-0 left-0 w-96 h-96 bg-forest rounded-full blur-3xl opacity-40 -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-forest-light rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-amber mb-6">
            <Sprout size={14} />
            How It Works
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white mb-5 leading-tight">
            From the market to your basket.
          </h1>
          <p className="text-warm-cream/80 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Here's exactly what happens on each side — whether you're shopping
            for fresh produce or selling it.
          </p>
        </div>
      </div>

      {/* Customer flow */}
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <div className="mb-12">
          <span className="inline-block text-xs font-semibold tracking-wide text-forest uppercase mb-3">
            Shopping on MarketLink
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-main">
            For customers
          </h2>
        </div>

        <div>
          {CUSTOMER_FLOW.map((step, i) => (
            <FlowStep key={step.title} step={step} index={i} accent="forest" />
          ))}
        </div>

        <Link
          to="/markets"
          className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
        >
          Find a Market
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Farmer flow */}
      <div className="bg-surface-sand py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12">
            <span className="inline-block text-xs font-semibold tracking-wide text-forest uppercase mb-3">
              Selling on MarketLink
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-main">
              For farmers
            </h2>
          </div>

          <div>
            {FARMER_FLOW.map((step, i) => (
              <FlowStep key={step.title} step={step} index={i} accent="amber" />
            ))}
          </div>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
          >
            Register Your Stall
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Quick facts strip */}
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-line bg-surface-cream p-6 shadow-soft">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest/10 text-forest mb-4">
              <MapPin size={20} />
            </span>
            <h3 className="font-display text-base font-semibold text-text-main mb-2">
              Real, physical markets
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Every market listed is a real farmers market — MarketLink helps you plan around it, not replace it.
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-surface-cream p-6 shadow-soft">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest/10 text-forest mb-4">
              <Clock size={20} />
            </span>
            <h3 className="font-display text-base font-semibold text-text-main mb-2">
              Cutoffs, set by farmers
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Each farmer sets their own order cutoff and pickup window per market — always check before you order.
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-surface-cream p-6 shadow-soft">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest/10 text-forest mb-4">
              <CheckCircle2 size={20} />
            </span>
            <h3 className="font-display text-base font-semibold text-text-main mb-2">
              Approved farmers only
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Every farmer stall is reviewed before it goes live, so you know who you're buying from.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}