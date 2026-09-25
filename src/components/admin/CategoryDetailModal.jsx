import Modal from '@/components/ui/Modal'
import StatusBadge from '@/components/ui/StatusBadge'
import { ImageOff } from 'lucide-react'

export default function CategoryDetailModal({ category, open, onClose }) {
  if (!category) return null

  return (
    <Modal open={open} onClose={onClose} title="Category Details" size="sm">
      <div className="space-y-4">
        {/* Image */}
        <div className="w-full h-40 rounded-md overflow-hidden border border-line bg-bg-ivory flex items-center justify-center">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageOff className="w-6 h-6 text-text-secondary" strokeWidth={1.5} />
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="font-display text-xl font-medium text-text-main">{category.name}</p>
          <StatusBadge status={category.status} />
        </div>

        <div className="pt-3 border-t border-line/60">
          <p className="text-xs text-text-secondary">Category ID</p>
          <p className="text-sm font-medium text-text-main">{category.id}</p>
        </div>
      </div>
    </Modal>
  )
}