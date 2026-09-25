import Modal from '@/components/ui/Modal'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatCurrency } from '@/lib/format'

export default function ProductDetailModal({ product, open, onClose }) {
  if (!product) return null

  return (
    <Modal open={open} onClose={onClose} title="Product Details" size="md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xl font-medium text-text-main">{product.name}</p>
            <p className="text-sm text-text-secondary">{product.farmer}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge status={product.availability} />
            <StatusBadge status={product.moderation} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-line/60">
          <div>
            <p className="text-xs text-text-secondary">Product ID</p>
            <p className="text-sm font-medium text-text-main">{product.id}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Category</p>
            <p className="text-sm font-medium text-text-main">{product.category}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Price</p>
            <p className="text-sm font-medium text-text-main">
              {formatCurrency(product.price)} / {product.unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Stock</p>
            <p className="text-sm font-medium text-text-main">
              {product.stock} {product.unit}
              {product.stock === 0 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}