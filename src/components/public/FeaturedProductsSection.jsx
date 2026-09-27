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
    <div className="snap-start shrink-0 w-[calc(50%-8px)] sm:w-[240px] rounded-2xl border border-line bg-surface-cream overflow-hidden animate-pulse">
      <div className="h-36 sm:h-40 bg-line" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 bg-line rounded" />
        <div className="h-3 w-1/2 bg-line rounded" />
        <div className="h-4 w-1/3 bg-line rounded" />
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  const status = STATUS_LABEL[product.status]
  const isSoldOut = product.status === 'sold_out'

  const { addItem } = useCartStore()
  const { isFavorite, toggleFavorite } = useFavoritesStore()
  const requireAuth = useRequireAuth()
  const isFav = isFavorite(product.id)

  const handleToggleFavorite = requireAuth((e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product.id)
    toast.success(isFav ? 'Removed from favorites' : 'Added to favorites')
  })

  const handleAddToCart = requireAuth((e) => {
    e.preventDefault()
    e.stopPropagation()
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
    <Link
      to={`/products/${product.id}`}
      className="group snap-start shrink-0 w-[calc(50%-8px)] sm:w-[240px] rounded-2xl border border-line bg-surface-cream overflow-hidden hover:shadow-card transition-shadow"
    >
      <div className="relative h-36 sm:h-40 bg-surface-sand overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${status.className}`}>
          {status.text}
        </span>

        {/* Favorite toggle */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-surface-cream/90 backdrop-blur-sm shadow-sm hover:bg-surface-cream transition-colors"
          aria-label="Toggle favorite"
        >
          <Heart
            size={14}
            className={clsx(isFav ? 'fill-error text-error' : 'text-text-secondary')}
          />
        </button>
      </div>

      <div className="p-3.5 sm:p-4">
        <p className="text-sm font-semibold text-text-main truncate">{product.name}</p>
        <p className="text-xs text-text-secondary mt-0.5 truncate">{product.farmer}</p>

        <div className="flex items-center justify-between mt-2.5">
          <p className="text-sm font-semibold text-forest">
            Rs. {product.price} / {product.unit}
          </p>

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-white hover:bg-forest-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Add to cart"
          >
            <ShoppingCart size={13} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="flex items-center gap-1 text-xs text-text-secondary">
            <Star size={12} className="fill-amber text-amber" />
            {product.rating} ({product.reviews})
          </span>
          {!isSoldOut && (
            <span className="text-[11px] text-text-secondary">
              {product.stock} {product.unit} left
            </span>
          )}
        </div>
      </div>
    </Link>
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