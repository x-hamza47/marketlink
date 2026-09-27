import { Link } from 'react-router-dom'
import { MapPin, Users, ArrowRight } from 'lucide-react'
import MarketPreviewMap from './MarketPreviewMap'
import { useGeolocation } from '@/hooks/useGeolocation'

const NEARBY_MARKETS = [
  { id: 'MKT-301', name: 'Sunday Green Market', distance: '2.4 km away', day: 'Open Sunday', farmers: 32, lat: 24.885, lng: 67.03 },
  { id: 'MKT-302', name: 'Community Fresh Market', distance: '4.1 km away', day: 'Open Saturday', farmers: 28, lat: 24.845, lng: 67.065 },
  { id: 'MKT-303', name: 'Organic Bazar', distance: '5.3 km away', day: 'Open Daily', farmers: 18, lat: 24.82, lng: 67.01 },
]

export default function FindMarketSection() {
  const { location, status } = useGeolocation()

  return (
    <section className="bg-bg-ivory py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left: Copy */}
          <div className="lg:col-span-4">
            <span className="inline-block text-xs font-semibold tracking-wide text-forest uppercase mb-3">
              Explore Nearby
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-main mb-4 leading-tight">
              Find your local market.
            </h2>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6 max-w-sm">
              Explore farmers markets around you, check locations and plan your pickup.
            </p>
            <Link
              to="/markets"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
            >
              Explore Markets
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right: Map + List */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-line shadow-soft bg-surface-cream">

              <div className="relative h-56 sm:h-auto min-h-[280px] bg-surface-sand">
                <MarketPreviewMap
                  markets={NEARBY_MARKETS}
                  userLocation={location}
                  nearestMarketId={NEARBY_MARKETS[0].id}
                />
                {location && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-surface-cream/95 px-2.5 py-1 shadow-md pointer-events-none">
                    <span className="h-2 w-2 rounded-full bg-forest animate-pulse" />
                    <span className="text-[10px] font-medium text-text-main">
                      {status === 'granted' ? 'Your location' : 'Locating…'}
                    </span>
                  </div>
                )}
              </div>

              <div className="divide-y divide-line">
                {NEARBY_MARKETS.map((market) => (
                  <Link
                    key={market.id}
                    to={`/markets/${market.id}`}
                    className="flex items-start gap-3 p-4 sm:p-5 hover:bg-forest/5 transition-colors"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                      <MapPin size={16} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-main truncate">{market.name}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{market.distance}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-text-secondary">{market.day}</span>
                        <span className="flex items-center gap-1 text-xs text-text-secondary">
                          <Users size={12} />
                          {market.farmers} Farmers
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link
                  to="/markets"
                  className="flex items-center justify-center gap-1.5 p-4 text-sm font-medium text-forest hover:bg-forest/5 transition-colors"
                >
                  View All Markets
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}