import { useParams, Link } from 'react-router-dom'
import { Store, MapPin, Calendar, Heart, ChevronRight, Star } from 'lucide-react'
import { useFarmerProfile, useFarmerProductsList } from '@/features/public/useFarmerDetail'
import { useFarmerReviews } from '@/features/public/useReviews'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import ProductCard from '@/components/public/ProductCard'
import { toast } from 'sonner'
import clsx from 'clsx'

export default function FarmerDetailPage() {
  const { id } = useParams()
  const { data: farmer, isLoading, isError } = useFarmerProfile(id)
  const { data: products, isLoading: productsLoading } = useFarmerProductsList(id)
  const { data: reviews, isLoading: reviewsLoading } = useFarmerReviews(id)

  const { isFavoriteFarmer, toggleFavoriteFarmer } = useFavoritesStore()
  const requireAuth = useRequireAuth()

  const isFav = isFavoriteFarmer(id)

  const handleToggleFavorite = requireAuth(() => {
    toggleFavoriteFarmer(id)
    toast.success(isFav ? 'Removed from favorites' : 'Added to favorites')
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14 animate-pulse">
        <div className="h-8 w-1/3 bg-line rounded mb-3" />
        <div className="h-4 w-1/2 bg-line rounded" />
      </div>
    )
  }

  if (isError || !farmer) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 text-center">
        <p className="text-text-main font-medium mb-2">Farmer not found</p>
        <Link to="/markets" className="text-sm text-forest hover:underline">
          Back to Markets
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-bg-ivory min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-14">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-6">
          <Link to="/" className="hover:text-forest">Home</Link>
          <ChevronRight size={12} />
          <Link to="/markets" className="hover:text-forest">Markets</Link>
          <ChevronRight size={12} />
          <span className="text-text-main">{farmer.stallName}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 rounded-2xl border border-line bg-surface-cream p-5 sm:p-6">
          <div className="flex items-start gap-4 min-w-0">
            <span className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
              <Store size={28} />
            </span>
            <div className="min-w-0">
              <h1 className="font-display text-xl sm:text-2xl font-semibold text-text-main truncate">
                {farmer.stallName}
              </h1>
              <p className="text-sm text-text-secondary">{farmer.userId?.name}</p>
              {farmer.location?.address && (
                <p className="flex items-center gap-1.5 text-xs text-text-secondary mt-1">
                  <MapPin size={12} />
                  {farmer.location.address}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleFavorite}
            className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-line hover:border-error transition-colors"
            aria-label="Toggle favorite"
          >
            <Heart size={18} className={clsx(isFav ? 'fill-error text-error' : 'text-text-secondary')} />
          </button>
        </div>

        {/* Description */}
        {farmer.description && (
          <p className="text-sm text-text-secondary mb-8 leading-relaxed">
            {farmer.description}
          </p>
        )}

        {/* Markets this farmer attends */}
        {farmer.markets?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-text-main mb-3">Available At</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {farmer.markets.map((m, i) => (
                <div key={i} className="rounded-xl border border-line bg-surface-cream p-4">
                  <p className="text-sm font-semibold text-text-main">
                    {m.marketId?.name || 'Market'}
                  </p>
                  {m.marketId?.address && (
                    <p className="text-xs text-text-secondary mt-0.5">{m.marketId.address}</p>
                  )}
                  <p className="flex items-center gap-1.5 text-xs text-text-secondary mt-2">
                    <Calendar size={12} />
                    {(m.operatingDays || []).join(', ')}
                  </p>
                  {m.pickupStart && (
                    <p className="text-xs text-text-secondary mt-1">
                      Pickup: {m.pickupStart} – {m.pickupEnd}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <div className="mb-14">
          <h2 className="text-sm font-semibold text-text-main mb-4">Products</h2>
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl border border-line bg-surface-cream animate-pulse" />
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <p className="text-sm text-text-secondary py-8 text-center">
              No products listed yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

        {/* Customer Reviews */}
        <div className="border-t border-line pt-10">
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-text-main mb-6">
            Customer Reviews
          </h2>

          {reviewsLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-surface-cream rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <p className="text-sm text-text-secondary py-6">
              No reviews yet for this farmer.
            </p>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-line pb-5 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-full bg-forest/10 flex items-center justify-center text-xs font-semibold text-forest shrink-0">
                      {review.customerName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-main">{review.customerName}</p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            className={i < review.rating ? 'fill-amber text-amber' : 'text-line'}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-text-secondary ml-auto">{review.date}</span>
                  </div>
                  <p className="text-sm text-text-secondary">{review.comment}</p>

                  {/* Farmer response */}
                  {review.farmerResponse && (
                    <div className="mt-3 ml-4 pl-3.5 border-l-2 border-forest/40 bg-surface-sand/30 rounded-r-xl p-3">
                      <p className="text-xs font-semibold text-forest flex items-center gap-1.5 mb-1">
                        <Store size={13} />
                        <span>Farmer Response</span>
                      </p>
                      <p className="text-sm text-text-main">{review.farmerResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}