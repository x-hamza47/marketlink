import { Link } from 'react-router-dom'
import { Star, Heart, ShoppingCart } from 'lucide-react'
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

export default function ProductCard({ product, className }) {
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
      className={clsx(
        'group rounded-2xl border border-line bg-surface-cream overflow-hidden hover:shadow-card transition-shadow',
        className
      )}
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

        <button
          type="button"
          onClick={handleToggleFavorite}
          className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-surface-cream/90 backdrop-blur-sm shadow-sm hover:bg-surface-cream transition-colors"
          aria-label="Toggle favorite"
        >
          <Heart size={14} className={clsx(isFav ? 'fill-error text-error' : 'text-text-secondary')} />
        </button>
      </div>

      <div className="p-3.5 sm:p-4">
        <p className="text-sm font-semibold text-text-main truncate">{product.name}</p>
        <p className="text-xs text-text-secondary mt-0.5 truncate">{product.farmer}</p>

        <div className="flex items-center justify-between mt-2.5">
          <p className="text-sm font-semibold text-forest">
            Rs. {product.price} / {product.unit}
          </p>
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
          {product.rating != null && (
            <span className="flex items-center gap-1 text-xs text-text-secondary">
              <Star size={12} className="fill-amber text-amber" />
              {product.rating} ({product.reviews})
            </span>
          )}
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