import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Store, LogIn, UserPlus } from 'lucide-react'
import { useFavoriteFarmers, useFavoriteProducts } from '@/features/public/useFavorites'
import { useAuthStore } from '@/stores/authStore'
import ProductCard from '@/components/public/ProductCard'
import clsx from 'clsx'

const TABS = [
  { value: 'products', label: 'Products' },
  { value: 'farmers', label: 'Farmers' },
]

function mapFavoriteProductToCard(p) {
  const farmerProfile = p.farmerId || null
  const stockQuantity = p.stockQuantity ?? 0
  const status = !p.isAvailable || stockQuantity === 0
    ? 'sold_out'
    : stockQuantity < 5
      ? 'limited'
      : 'available'

  return {
    id: p._id,
    name: p.name,
    category: p.category,
    price: p.price,
    unit: p.unit,
    stock: stockQuantity,
    image: p.imageUrl || '',
    farmer: farmerProfile?.userId?.name || farmerProfile?.stallName || 'Unknown farmer',
    farmerId: farmerProfile?._id || null,
    status,
    rating: null,
    reviews: 0,
    farmerMarkets: (farmerProfile?.markets || []).map((m) => ({
      marketId: m.marketId?._id || m.marketId,
      marketName: m.marketId?.name || '',
      marketAddress: m.marketId?.address || '',
      operatingDays: m.operatingDays,
      pickupStart: m.pickupStart,
      pickupEnd: m.pickupEnd,
      cutoffHours: m.cutoffHours,
    })),
  }
}

export default function FavoritesPage() {
  const [tab, setTab] = useState('products')
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const { data: rawFavFarmers, isLoading: farmersLoading } = useFavoriteFarmers()
  const { data: rawFavProducts, isLoading: productsLoading } = useFavoriteProducts()

  const favFarmers = (rawFavFarmers || []).filter(Boolean)
  const favProducts = (rawFavProducts || []).filter(Boolean)

  if (!isAuthenticated) {
    return (
      <div className="bg-bg-ivory min-h-screen">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center bg-surface-cream rounded-3xl border border-line p-8 sm:p-12 shadow-soft max-w-lg mx-auto">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest mx-auto mb-5">
              <Heart size={30} className="fill-forest/20 text-forest" />
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text-main mb-2">
              Sign in to view favorites
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed mb-8">
              Keep track of your favorite local farmers, fresh produce, and markets all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/login"
                state={{ from: { pathname: '/favorites' } }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white hover:bg-forest-dark transition-colors shadow-sm"
              >
                <LogIn size={16} />
                Sign In
              </Link>
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface-cream px-6 py-2.5 text-sm font-medium text-text-main hover:border-forest hover:text-forest transition-colors"
              >
                <UserPlus size={16} />
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-ivory min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-14">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-text-main mb-1.5 sm:mb-2">
            My Favorites
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm lg:text-base">
            Quick access to farmers and products you love.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 sm:mb-8">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={clsx(
                'rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium border transition-colors',
                tab === t.value
                  ? 'bg-forest text-white border-forest'
                  : 'border-line text-text-secondary hover:border-forest'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'products' ? (
          productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl border border-line bg-surface-cream animate-pulse" />
              ))}
            </div>
          ) : !favProducts || favProducts.length === 0 ? (
            <EmptyState
              icon={<Heart size={26} />}
              text="No favorite products yet"
              cta="Browse Products"
              to="/products"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {favProducts.map((p) => (
                <ProductCard key={p._id} product={mapFavoriteProductToCard(p)} />
              ))}
            </div>
          )
        ) : farmersLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl border border-line bg-surface-cream animate-pulse" />
            ))}
          </div>
        ) : !favFarmers || favFarmers.length === 0 ? (
          <EmptyState
            icon={<Store size={26} />}
            text="No favorite farmers yet"
            cta="Browse Markets"
            to="/markets"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favFarmers.map((f) => (
              <Link
                key={f._id}
                to={`/farmers/${f._id}`}
                className="flex items-center gap-4 rounded-2xl border border-line bg-surface-cream p-4 hover:border-forest transition-colors"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                  <Store size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-main truncate">{f.stallName}</p>
                  <p className="text-xs text-text-secondary truncate">{f.userId?.name}</p>
                  <p className="text-xs text-text-secondary truncate">{f.location?.address}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ icon, text, cta, to }) {
  return (
    <div className="text-center py-16">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-forest mx-auto mb-4">
        {icon}
      </span>
      <p className="text-text-main font-medium mb-1 text-sm sm:text-base">{text}</p>
      <Link
        to={to}
        className="inline-flex items-center gap-2 rounded-full bg-forest px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-forest-dark transition-colors mt-2"
      >
        {cta}
      </Link>
    </div>
  )
}