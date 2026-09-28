import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import heroImage from '../../assets/images/hero-image2.jpeg'
import {
  Search,
  MapPin,
  ShoppingBasket,
  CreditCard,
  Users,
  Calendar,
} from 'lucide-react'

const TRUST_BADGES = [
  { icon: MapPin, label: 'Find Markets', sub: 'Nearby' },
  { icon: ShoppingBasket, label: 'Reserve & Pickup', sub: 'Pre-order' },
  { icon: CreditCard, label: 'Pay at Pickup', sub: 'No online payment' },
  { icon: Users, label: 'Support Local', sub: 'Stronger community' },
]

export default function Hero() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const query = search.trim()
    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`)
    } else {
      navigate('/products')
    }
  }

  const handleNearMe = () => {
    navigate('/markets')
  }

  return (
    <section className="bg-bg-ivory overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">

          {/* LEFT */}
          <div className="lg:col-span-6 max-w-xl lg:max-w-none relative z-20">
            <span className="inline-block rounded-full bg-forest/10 px-3.5 py-1 text-xs font-medium text-forest mb-4">
              Fresh. Local. Connected.
            </span>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.15] sm:leading-[1.1] text-forest mb-4 tracking-tight">
              Fresh from local farmers. Closer to you.
            </h1>

            <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-md">
              MarketLink connects you with local farmers and markets. Discover
              fresh products, check availability, and reserve for pickup at
              your nearest market.
            </p>

            {/* SEARCH */}
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 rounded-2xl sm:rounded-full bg-surface-cream border border-line p-2 sm:p-1.5 shadow-sm max-w-lg mb-8 sm:mb-10"
            >
              <div className="flex flex-1 items-center gap-2 px-2 sm:pl-3">
                <Search
                  size={18}
                  className="text-text-secondary shrink-0"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search markets, farmers or products..."
                  className="w-full bg-transparent text-sm text-text-main placeholder:text-text-secondary outline-none py-1.5 sm:py-0"
                />
              </div>

              <button
                type="button"
                onClick={handleNearMe}
                className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs text-text-secondary hover:text-text-main transition-colors shrink-0 border-t sm:border-t-0 sm:border-l border-line/60 justify-center sm:justify-start"
              >
                <MapPin size={14} className="text-forest" />
                <span>Near me</span>
              </button>

              <button
                type="submit"
                className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white hover:bg-forest-dark transition-colors shrink-0 sm:ml-1"
              >
                Explore
              </button>
            </form>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest/10 text-forest shrink-0">
                    <Icon size={15} />
                  </span>

                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-semibold text-text-main">
                      {label}
                    </span>

                    <span className="text-[11px] text-text-secondary">
                      {sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="lg:col-span-6 relative min-h-[420px] sm:min-h-[460px] lg:min-h-[500px]">

            {/* BLEEDING IMAGE */}
            <div className="absolute inset-y-0 right-[-15%] w-[115%] lg:w-[125%]">

              <img
                src={heroImage} 
                alt="Local farmer at a market stall"
                className="
        absolute inset-0
        h-full w-full
        object-cover
        object-center
      "
              />

              {/* LEFT BLEND */}
              <div
                className="
        absolute inset-y-0 left-0
        w-[55%]
        bg-gradient-to-r
        from-bg-ivory
        via-bg-ivory/80
        to-transparent
        pointer-events-none
      "
              />

              {/* TOP BLEND */}
              <div
                className="
        absolute inset-x-0 top-0
        h-32
        bg-gradient-to-b
        from-bg-ivory
        via-bg-ivory/40
        to-transparent
        pointer-events-none
      "
              />

              {/* BOTTOM BLEND */}
              <div
                className="
        absolute inset-x-0 bottom-0
        h-36
        bg-gradient-to-t
        from-bg-ivory
        via-bg-ivory/40
        to-transparent
        pointer-events-none
      "
              />

              {/* RIGHT BLEND */}
              <div
                className="
        absolute inset-y-0 right-0
        w-20
        bg-gradient-to-l
        from-bg-ivory/30
        to-transparent
        pointer-events-none
      "
              />
            </div>

            {/* MARKET CARD */}
            <div className="absolute top-8 left-0 lg:-left-4 z-10 w-44 sm:w-52 rounded-2xl bg-surface-cream/95 backdrop-blur-md p-3.5 shadow-xl border border-line">
              <p className="text-xs font-bold text-text-main mb-0.5">
                Green Valley Market
              </p>

              <p className="flex items-center gap-1 text-[11px] text-text-secondary mb-2">
                <MapPin size={11} className="text-amber-dark" />
                2.4 km away
              </p>

              <div className="text-[11px] text-text-secondary mb-3 space-y-0.5">
                <p className="font-medium text-text-main">
                  Open Today
                </p>
                <p>7:00 AM – 1:00 PM</p>
              </div>

              <Link
                to="/markets"
                className="block w-full rounded-full bg-forest py-1.5 text-center text-xs font-medium text-white hover:bg-forest-dark transition-colors"
              >
                View Market
              </Link>
            </div>

            {/* PRODUCT CARD */}
            <div className="absolute top-[45%] right-0 lg:-right-4 z-10 flex items-center gap-3 rounded-2xl bg-surface-cream/95 backdrop-blur-md p-3 shadow-xl border border-line w-48 sm:w-56">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-error/10 flex items-center justify-center text-error">
                <ShoppingBasket className="w-5 h-5" strokeWidth={1.75} />
              </div>

              <div className="leading-tight">
                <p className="text-xs font-bold text-text-main">
                  Fresh Tomatoes
                </p>

                <p className="text-[11px] font-semibold text-text-main mt-0.5">
                  Rs. 250 / kg
                </p>

                <p className="text-[10px] text-text-secondary mt-0.5">
                  Available: 35 kg
                </p>
              </div>
            </div>

            {/* PICKUP CARD */}
            <div className="absolute bottom-5 left-4 sm:left-8 lg:left-12 z-10 flex items-center gap-3 rounded-2xl bg-surface-cream/95 backdrop-blur-md px-4 py-3 shadow-xl border border-line">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest">
                <Calendar size={16} />
              </div>

              <div className="leading-tight">
                <p className="text-[11px] font-medium text-text-secondary">
                  Pickup Time
                </p>

                <p className="text-xs font-semibold text-text-main mt-0.5">
                  Sun, 12 May
                </p>

                <p className="text-[10px] text-text-secondary">
                  9:00 AM – 10:00 AM
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

