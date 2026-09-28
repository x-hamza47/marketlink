import { Link } from 'react-router-dom'
import CtaBanner from '../../assets/images/cta-banner.jpeg'

export default function CtaBannerSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-72 sm:h-80">
        <img
          src={CtaBanner}
          alt="Fresh produce basket"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="relative h-full mx-auto max-w-7xl px-6 flex flex-col items-start justify-center">
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white max-w-lg mb-3 leading-tight">
            Your local market is closer than you think.
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-md mb-6">
            Discover farmers, explore fresh products and reserve your next
            market pickup with MarketLink.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/markets"
              className="rounded-full border border-white px-6 py-3 text-sm font-medium text-white hover:bg-white hover:text-forest transition-colors"
            >
              Explore Markets
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-forest px-6 py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
            >
              Join MarketLink
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}