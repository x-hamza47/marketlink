import Modal from '@/components/ui/Modal'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/format'

export default function FarmerDetailModal({ farmer, open, onClose }) {
  if (!farmer) return null

  return (
    <Modal open={open} onClose={onClose} title="Farmer Details" size="md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xl font-medium text-text-main">{farmer.name}</p>
            <p className="text-sm text-text-secondary">{farmer.stall}</p>
          </div>
          <StatusBadge status={farmer.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-line/60">
          <div>
            <p className="text-xs text-text-secondary">Farmer ID</p>
            <p className="text-sm font-medium text-text-main">{farmer.id}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Markets</p>
            <p className="text-sm font-medium text-text-main">{farmer.markets}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Registered</p>
            <p className="text-sm font-medium text-text-main">{formatDate(farmer.registered)}</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}