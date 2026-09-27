import { useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { MapPin, Users, Clock, Calendar, ChevronRight, ShoppingBasket, ChevronLeft } from 'lucide-react'
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
  const [params, setParams] = useSearchParams()
  const productsPage = Number(params.get('page')) || 1

  const { data: market, isLoading, isError } = useMarketDetail(id)

  const { data: productsData, isLoading: productsLoading, isFetching: productsFetching } =
    useMarketProducts(id, { page: productsPage, limit: 3 })
  const { data: farmers, isLoading: farmersLoading } = useMarketFarmers(id)
  const { location } = useGeolocation()

  const [activeTab, setActiveTab] = useState('products')

  const products = productsData?.items ?? []
  const totalProducts = productsData?.total ?? 0
  const totalPages = productsData?.pages ?? 1

  function goToProductsPage(nextPage) {
    const next = new URLSearchParams(params)
    if (nextPage <= 1) next.delete('page')
    else next.set('page', String(nextPage))
    setParams(next, { replace: true })
  }

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

        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden h-52 sm:h-72 bg-surface-sand mb-8">
          {market.image ? (
            <img src={market.image} alt={market.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-forest to-forest-dark" />
          )}
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
              {(market.operatingDays || []).join(', ')}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface-cream p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/10 text-forest mb-2">
              <Clock size={16} />
            </span>
            <p className="text-xs text-text-secondary">Hours</p>
            <p className="text-sm font-semibold text-text-main">
              {market.timings?.open} – {market.timings?.close}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface-cream p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/10 text-forest mb-2">
              <Users size={16} />
            </span>
            <p className="text-xs text-text-secondary">Farmers</p>
            <p className="text-sm font-semibold text-text-main">
              {farmersLoading ? '…' : farmers?.length ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface-cream p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/10 text-forest mb-2">
              <ShoppingBasket size={16} />
            </span>
            <p className="text-xs text-text-secondary">Products Listed</p>
            <p className="text-sm font-semibold text-text-main">
              {productsLoading ? '…' : totalProducts}
            </p>
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
              selectedMarketId={market._id}
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
            Products ({totalProducts})
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
            ) : products.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-16">
                No products listed for this market yet.
              </p>
            ) : (
              <>
                <div className={clsx(
                  'grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 transition-opacity',
                  productsFetching && 'opacity-60'
                )}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => goToProductsPage(productsPage - 1)}
                      disabled={productsPage <= 1}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-text-main hover:border-forest disabled:opacity-40 disabled:pointer-events-none"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-text-secondary px-2">
                      Page {productsPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => goToProductsPage(productsPage + 1)}
                      disabled={productsPage >= totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-text-main hover:border-forest disabled:opacity-40 disabled:pointer-events-none"
                      aria-label="Next page"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
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
                  <Link
                    to={`/farmers/${farmer.id}`}
                    key={farmer.id}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-surface-cream p-4 hover:border-forest transition-colors"
                  >
                    <div className="h-11 w-11 shrink-0 rounded-full bg-forest/10 flex items-center justify-center text-sm font-semibold text-forest">
                      {farmer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-main">{farmer.name}</p>
                      <p className="text-xs text-text-secondary">{farmer.stall}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}