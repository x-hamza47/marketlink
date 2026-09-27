import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Heart, ShoppingCart, MapPin, Calendar, ChevronRight, Minus, Plus } from 'lucide-react'
import {
  useProductDetail,
  useProductReviews,
  useRelatedProducts,
} from '@/features/public/useProductDetail'
import { useCartStore } from '@/stores/cartStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { useAuthStore } from '@/stores/authStore'
import ProductCard from '@/components/public/ProductCard'
import { toast } from 'sonner'
import clsx from 'clsx'

const STATUS_LABEL = {
  available: { text: 'Available', className: 'bg-forest/10 text-forest' },
  limited: { text: 'Limited Stock', className: 'bg-amber/15 text-amber-dark' },
  sold_out: { text: 'Sold Out', className: 'bg-error/10 text-error' },
}


export default function ProductDetailPage() {
  const { id } = useParams()
  const { data: product, isLoading, isError } = useProductDetail(id)
  const { data: reviews, isLoading: reviewsLoading } = useProductReviews(id)
  const { data: related } = useRelatedProducts(id, product?.category)

  const [quantity, setQuantity] = useState(1)

  const { addItem } = useCartStore()
  const { isFavoriteProduct, toggleFavoriteProduct } = useFavoritesStore()
  const { isAuthenticated } = useAuthStore()
  const requireAuth = useRequireAuth()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-14 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="h-96 bg-line rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-line rounded" />
            <div className="h-4 w-1/3 bg-line rounded" />
            <div className="h-6 w-1/4 bg-line rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-text-main font-medium mb-2">Product not found</p>
        <Link to="/products" className="text-sm text-forest hover:underline">
          Back to Products
        </Link>
      </div>
    )
  }

  const status = STATUS_LABEL[product.status]
  const isSoldOut = product.status === 'sold_out'
  const isFav = isFavoriteProduct(product.id)
  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating ?? '-'

  const handleAddToCart = requireAuth(() => {
    const markets = product.farmerMarkets || []
    if (markets.length > 1) {
      toast.info('This farmer sells at multiple markets - market picker coming next')
    }
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        farmer: product.farmer,
        farmerId: product.farmerId,
        image: product.image,
        quantity,
      },
      markets[0] || null
    )
    toast.success(`${quantity} × ${product.name} added to cart`)
  })

  const handleToggleFavorite = requireAuth(() => {
    toggleFavoriteProduct(product.id)
    toast.success(isFav ? 'Removed from favorites' : 'Added to favorites')
  })

  return (
    <div className="bg-bg-ivory min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-6">
          <Link to="/" className="hover:text-forest">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-forest">Products</Link>
          <ChevronRight size={12} />
          <span className="text-text-main">{product.name}</span>
        </div>

        {/* Main detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden bg-surface-sand aspect-square lg:aspect-[4/5]">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            <span className={`absolute top-4 left-4 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}>
              {status.text}
            </span>
          </div>

          {/* Info */}
          <div>
            <span className="inline-block text-xs font-semibold tracking-wide text-forest uppercase mb-2">
              {product.category}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text-main mb-2">
              {product.name}
            </h1>
            <p className="text-sm text-text-secondary mb-4">Sold by {product.farmer}</p>

            <div className="flex items-center gap-2 mb-5">
              <Star size={16} className="fill-amber text-amber" />
              <span className="text-sm font-semibold text-text-main">{avgRating}</span>
              <span className="text-sm text-text-secondary">
                ({reviews?.length ?? product.reviews} reviews)
              </span>
            </div>

            <p className="font-display text-3xl font-semibold text-forest mb-1">
              Rs. {product.price} <span className="text-base font-normal text-text-secondary">/ {product.unit}</span>
            </p>
            <p className="text-sm text-text-secondary mb-6">
              {isSoldOut ? 'Currently unavailable' : `${product.stock} ${product.unit} in stock`}
            </p>

            {/* Market info */}
            {product.marketId && (
              <div className="flex items-center gap-4 mb-6 p-3.5 rounded-xl bg-surface-cream border border-line">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                  <MapPin size={16} />
                </span>
                <div>
                  <p className="text-xs text-text-secondary">Available at</p>
                  <Link to={`/markets/${product.marketId}`} className="text-sm font-medium text-text-main hover:text-forest">
                    View market details
                  </Link>
                </div>
                {product.marketDay && (
                  <span className="flex items-center gap-1.5 ml-auto text-xs text-text-secondary">
                    <Calendar size={13} />
                    {product.marketDay}
                  </span>
                )}
              </div>
            )}

            {/* Quantity + actions */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center rounded-full border border-line overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-11 w-11 flex items-center justify-center text-text-main hover:bg-bg-ivory"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-11 w-11 flex items-center justify-center text-text-main hover:bg-bg-ivory"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={16} />
                {isSoldOut ? 'Sold Out' : 'Add to Cart'}
              </button>

              <button
                type="button"
                onClick={handleToggleFavorite}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line hover:border-error transition-colors"
                aria-label="Toggle favorite"
              >
                <Heart size={18} className={clsx(isFav ? 'fill-error text-error' : 'text-text-secondary')} />
              </button>
            </div>

            {!isAuthenticated && (
              <p className="text-xs text-text-secondary">
                <Link to="/login" className="text-forest hover:underline">Log in</Link> to add items to your cart or favorites.
              </p>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="border-t border-line pt-10 mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-text-main">
              Customer Reviews
            </h2>
          </div>
          <p className="text-xs text-text-secondary -mt-4 mb-6">
            You can leave a review from your completed orders.
          </p>

          {reviewsLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-surface-cream rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <p className="text-sm text-text-secondary py-6">
              No reviews yet. Be the first to share your experience.
            </p>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-line pb-5 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-full bg-forest/10 flex items-center justify-center text-xs font-semibold text-forest shrink-0">
                      {review.customerName.charAt(0).toUpperCase()}
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related products */}
        {related && related.length > 0 && (
          <div className="border-t border-line pt-10">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-text-main mb-6">
              You might also like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}