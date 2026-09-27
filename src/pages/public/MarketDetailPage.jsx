// src/pages/public/MarketDetailPage.jsx
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Users, Clock, Calendar, ChevronRight, ShoppingBasket } from 'lucide-react'
import {
  useMarketDetail,
  useMarketProducts,
  useMarketFarmers,
} from '@/features/public/useMarkets'
import ProductCard from '@/components/public/ProductCard'
import MarketMap from '@/components/shared/MarketMap'
import clsx from 'clsx'
import { useGeolocation } from '@/hooks/useGeolocation'


export default function MarketDetailPage() {
  const { id } = useParams()
  const { data: market, isLoading, isError } = useMarketDetail(id)
  const { data: products, isLoading: productsLoading } = useMarketProducts(id)
  const { data: farmers, isLoading: farmersLoading } = useMarketFarmers(id)
  const { location } = useGeolocation()

  const [activeTab, setActiveTab] = useState('products') // 'products' | 'farmers'

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-14 animate-pulse">
        <div className="h-64 bg-line rounded-3xl mb-8" />
        <div className="space-y-3">
          <div className="h-8 w-1/3 bg-line rounded" />
          <div className="h-4 w-1/2 bg-line rounded" />
        </div>
      </div>
    )
  }

  if (isError || !market) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-text-main font-medium mb-2">Market not found</p>
        <Link to="/markets" className="text-sm text-forest hover:underline">
          Back to Markets
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-bg-ivory min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-6">
          <Link to="/" className="hover:text-forest">Home</Link>
          <ChevronRight size={12} />
          <Link to="/markets" className="hover:text-forest">Markets</Link>
          <ChevronRight size={12} />
          <span className="text-text-main">{market.name}</span>
        </div>

        {/* Banner image */}
        <div className="relative rounded-3xl overflow-hidden h-52 sm:h-72 bg-surface-sand mb-8">
          <img src={market.image} alt={market.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-6 right-6">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-1">
              {market.name}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-white/90">
              <MapPin size={14} />
              {market.address}
            </p>
          </div>
        </div>

        {/* Info strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="rounded-2xl border border-line bg-surface-cream p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/10 text-forest mb-2">
              <Calendar size={16} />
            </span>
            <p className="text-xs text-text-secondary">Open Days</p>
            <p className="text-sm font-semibold text-text-main">
              {market.operatingDays.join(', ')}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface-cream p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/10 text-forest mb-2">
              <Clock size={16} />
            </span>
            <p className="text-xs text-text-secondary">Hours</p>
            <p className="text-sm font-semibold text-text-main">
              {market.openingTime} – {market.closingTime}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface-cream p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/10 text-forest mb-2">
              <Users size={16} />
            </span>
            <p className="text-xs text-text-secondary">Farmers</p>
            <p className="text-sm font-semibold text-text-main">{market.farmers}</p>
          </div>

          <div className="rounded-2xl border border-line bg-surface-cream p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/10 text-forest mb-2">
              <ShoppingBasket size={16} />
            </span>
            <p className="text-xs text-text-secondary">Products Listed</p>
            <p className="text-sm font-semibold text-text-main">{market.products}</p>
          </div>
        </div>

        {/* Map */}
        <div className="mb-10">
          <h2 className="font-display text-xl font-semibold text-text-main mb-4">
            Location
          </h2>
          <div className="h-72 sm:h-96 rounded-3xl overflow-hidden">
            <MarketMap
            userLocation={location}
              markets={[market]}
              selectedMarketId={market.id}
              renderPopup={() => (
                <div className="text-sm">
                  <p className="font-medium text-text-main">{market.name}</p>
                  <p className="text-xs text-text-secondary">{market.address}</p>
                </div>
              )}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-line">
          <button
            onClick={() => setActiveTab('products')}
            className={clsx(
              'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === 'products'
                ? 'border-forest text-forest'
                : 'border-transparent text-text-secondary hover:text-text-main'
            )}
          >
            Products ({products?.length ?? 0})
          </button>
          <button
            onClick={() => setActiveTab('farmers')}
            className={clsx(
              'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === 'farmers'
                ? 'border-forest text-forest'
                : 'border-transparent text-text-secondary hover:text-text-main'
            )}
          >
            Farmers ({farmers?.length ?? 0})
          </button>
        </div>

        {/* Products tab */}
        {activeTab === 'products' && (
          <>
            {productsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-56 bg-surface-cream border border-line rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : !products || products.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-16">
                No products listed for this market yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Farmers tab */}
        {activeTab === 'farmers' && (
          <>
            {farmersLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-surface-cream border border-line rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : !farmers || farmers.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-16">
                No farmers found for this market yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {farmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-surface-cream p-4"
                  >
                    <div className="h-11 w-11 shrink-0 rounded-full bg-forest/10 flex items-center justify-center text-sm font-semibold text-forest">
                      {farmer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-main">{farmer.name}</p>
                      <p className="text-xs text-text-secondary">{farmer.stall}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}