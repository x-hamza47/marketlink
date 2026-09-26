import Modal from '@/components/ui/Modal'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/format'

export default function OrderDetailModal({ order, open, onClose }) {
  if (!order) return null

  return (
    <Modal open={open} onClose={onClose} title="Order Details" size="md">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xl font-medium text-text-main">#{order.id}</p>
            <p className="text-sm text-text-secondary">{order.customer}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Market + Pickup info */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-line/60">
          <div>
            <p className="text-xs text-text-secondary">Market</p>
            <p className="text-sm font-medium text-text-main">{order.market}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Pickup Date</p>
            <p className="text-sm font-medium text-text-main">{formatDate(order.pickupDate)}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Pickup Slot</p>
            <p className="text-sm font-medium text-text-main">{order.pickupSlot}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Order Cutoff</p>
            <p className="text-sm font-medium text-text-main">
              {order.cutoffTime ? formatDate(order.cutoffTime) : '—'}
            </p>
          </div>
        </div>

        {/* Items breakdown */}
        <div className="pt-3 border-t border-line/60">
          <p className="text-xs text-text-secondary mb-2">Items</p>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm px-3 py-2 rounded-md bg-bg-ivory"
              >
                <span className="text-text-main">{item.name}</span>
                <span className="text-text-secondary">
                  {item.quantity} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-3 border-t border-line/60">
          <p className="text-sm font-medium text-text-main">Total Amount</p>
          <p className="font-display text-lg font-medium text-forest">
            Rs. {order.total.toLocaleString()}
          </p>
        </div>
      </div>
    </Modal>
  )
}