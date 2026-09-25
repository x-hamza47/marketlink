import Modal from '@/components/ui/Modal'
import StatusBadge from '@/components/ui/StatusBadge'

export default function MarketDetailModal({ market, open, onClose }) {
  if (!market) return null

  return (
    <Modal open={open} onClose={onClose} title="Market Details" size="md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xl font-medium text-text-main">{market.name}</p>
            <p className="text-sm text-text-secondary">{market.address}</p>
          </div>
          <StatusBadge status={market.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-line/60">
          <div>
            <p className="text-xs text-text-secondary">Market ID</p>
            <p className="text-sm font-medium text-text-main">{market.id}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Operating Days</p>
            <p className="text-sm font-medium text-text-main">{market.operatingDays.join(', ')}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Farmers</p>
            <p className="text-sm font-medium text-text-main">{market.farmers}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Products</p>
            <p className="text-sm font-medium text-text-main">{market.products}</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}