import { MapPin, ClipboardList, Calendar, Truck } from 'lucide-react'

const STEPS = [
  { number: '01', icon: MapPin, title: 'Discover', desc: 'Find nearby markets, farmers and products.' },
  { number: '02', icon: ClipboardList, title: 'Browse', desc: 'Check availability, prices and farmer details.' },
  { number: '03', icon: Calendar, title: 'Reserve', desc: 'Place a pre-order and choose pickup time.' },
  { number: '04', icon: Truck, title: 'Pickup', desc: 'Visit the market and collect your order in person.' },
]

export default function HowItWorksSection() {
  return (
    <section className="bg-bg-ivory py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-wide text-forest uppercase mb-3">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-main">
            Simple steps. Fresh connections.
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 relative">
          {STEPS.map(({ number, icon: Icon, title, desc }, i) => (
            <div key={number} className="relative flex flex-col items-center text-center">
              {i < STEPS.length - 1 && (
                <div className="hidden sm:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] border-t border-dashed border-line" />
              )}
              <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest mb-4">
                <Icon size={24} />
              </span>
              <p className="text-xs font-semibold text-amber-dark mb-1">{number}</p>
              <h3 className="text-sm font-semibold text-text-main mb-1.5">{title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed max-w-[160px]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}