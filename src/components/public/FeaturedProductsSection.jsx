import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, ArrowRight, ChevronLeft, ChevronRight, Heart, ShoppingCart } from 'lucide-react'
import { useFeaturedProducts } from '@/features/public/useFeaturedProducts'
import { useCartStore } from '@/stores/cartStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { toast } from 'sonner'
import clsx from 'clsx'

const STATUS_LABEL = {
  available: { text: 'Available', className: 'bg-forest/10 text-forest' },
  limited: { text: 'Limited', className: 'bg-amber/15 text-amber-dark' },
  sold_out: { text: 'Sold Out', className: 'bg-error/10 text-error' },
}

function ProductCardSkeleton() {
  return (
    <div className="snap-start shrink-0 w-[82vw] max-w-[280px] sm:w-[240px] rounded-2xl border border-line bg-surface-cream overflow-hidden animate-pulse">
      <div className="h-44 sm:h-40 bg-line" />

      <div className="p-3.5 sm:p-4 space-y-2">
        <div className="h-4 w-3/4 bg-line rounded" />
        <div className="h-3 w-1/2 bg-line rounded" />
        <div className="h-5 w-1/3 bg-line rounded" />
        <div className="h-10 w-full bg-line rounded-xl mt-3" />
      </div>
    </div>
  )
}
function ProductCard({ product }) {
  const status = STATUS_LABEL[product.status]
  const isSoldOut = product.status === 'sold_out'

  const { addItem } = useCartStore()
  const { isFavoriteProduct, toggleFavoriteProduct } = useFavoritesStore()
  const requireAuth = useRequireAuth()
  const isFav = isFavoriteProduct(product.id)

  const handleToggleFavorite = requireAuth(() => {
    toggleFavoriteProduct(product.id)

    toast.success(
      isFav
        ? 'Removed from favorites'
        : 'Added to favorites'
    )
  })
  const handleAddToCart = requireAuth(() => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      farmer: product.farmer,
      image: product.image,
    })

    toast.success(`${product.name} added to cart`)
  })

  return (
    <article
      className="
        group snap-start shrink-0
        w-[82vw] max-w-[280px]
        sm:w-[240px]
        flex flex-col
        overflow-hidden
        rounded-2xl
        border border-line
        bg-surface-cream
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-card
      "
    >
      {/* Image */}
      <div className="relative h-44 sm:h-40 bg-surface-sand overflow-hidden">

        <Link
          to={`/products/${product.id}`}
          className="block h-full w-full"
        >
          <img
            src={product.image}
            alt={product.name}
            className="
              h-full w-full object-cover
              transition-transform duration-500
              group-hover:scale-105
            "
          />
        </Link>

        {/* Image overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Status */}
        <span
          className={`
            absolute left-3 top-3
            rounded-full
            px-2.5 py-1
            text-[10px] font-semibold
            backdrop-blur-sm
            ${status.className}
          `}
        >
          {status.text}
        </span>

        {/* Favorite */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="
            absolute right-3 top-3 z-10
            flex h-9 w-9
            items-center justify-center
            rounded-full
            bg-surface-cream/90
            shadow-sm
            backdrop-blur-sm
            transition-all
            hover:scale-105
            hover:bg-surface-cream
            active:scale-95
          "
          aria-label={
            isFav
              ? 'Remove from favorites'
              : 'Add to favorites'
          }
        >
          <Heart
            size={16}
            className={clsx(
              isFav
                ? 'fill-error text-error'
                : 'text-text-secondary'
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">

        {/* Name */}
        <Link
          to={`/products/${product.id}`}
          className="
            truncate
            text-sm font-semibold
            text-text-main
            hover:text-forest
            transition-colors
          "
        >
          {product.name}
        </Link>

        {/* Farmer */}
        <p className="mt-1 truncate text-xs text-text-secondary">
          {product.farmer}
        </p>

        {/* Price */}
        <div className="mt-2.5 flex items-baseline gap-1">
          <span className="text-lg font-bold text-forest">
            Rs. {product.price}
          </span>

          <span className="text-[11px] text-text-secondary">
            / {product.unit}
          </span>
        </div>

        {/* Rating + Reviews + Stock */}
        <div className="mt-2.5 flex items-center justify-between">

          <span className="flex items-center gap-1 text-xs text-text-secondary">
            <Star
              size={13}
              className="fill-amber text-amber"
            />

            <span className="font-medium text-text-main">
              {product.rating}
            </span>

            <span>
              ({product.reviews})
            </span>
          </span>

          {!isSoldOut && (
            <span className="text-[10px] text-text-secondary">
              {product.stock} {product.unit} left
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isSoldOut}
          className={clsx(
            `
              mt-3
              flex h-10 w-full
              items-center justify-center gap-2
              rounded-xl
              text-xs font-semibold
              transition-all
              active:scale-[0.98]
            `,
            isSoldOut
              ? 'cursor-not-allowed bg-line text-text-secondary'
              : 'bg-forest text-white hover:bg-forest-dark hover:shadow-sm'
          )}
        >
          <ShoppingCart size={15} />

          {isSoldOut ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </article>
  )
}


export default function FeaturedProductsSection() {
  const { data: products, isLoading, isError } = useFeaturedProducts()
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollButtons = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateScrollButtons()
  }, [products])

  const scrollByAmount = (direction) => {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.firstChild?.offsetWidth || 240
    scrollRef.current.scrollBy({
      left: direction * (cardWidth + 16),
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-bg-ivory py-14 sm:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <span className="inline-block text-xs font-semibold tracking-wide text-forest uppercase mb-3">
              Fresh Products
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-main mb-3 leading-tight">
              Fresh From Local Farmers
            </h2>
            <p className="text-text-secondary text-sm sm:text-base max-w-md">
              Browse weekly fresh products from local farmers and markets.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors w-fit shrink-0"
          >
            Explore Products
            <ArrowRight size={16} />
          </Link>
        </div>

        {isError ? (
          <p className="text-sm text-error text-center py-10">
            Couldn't load products right now.
          </p>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={() => scrollByAmount(-1)}
              disabled={!canScrollLeft}
              className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center rounded-full bg-surface-cream border border-line shadow-card text-text-main hover:border-forest hover:text-forest transition-colors disabled:opacity-0 disabled:pointer-events-none"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>

            <div
              ref={scrollRef}
              onScroll={updateScrollButtons}
              className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-6 px-6 sm:mx-0 sm:px-1"
            >
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>

            <button
              type="button"
              onClick={() => scrollByAmount(1)}
              disabled={!canScrollRight}
              className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center rounded-full bg-surface-cream border border-line shadow-card text-text-main hover:border-forest hover:text-forest transition-colors disabled:opacity-0 disabled:pointer-events-none"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}