import { Package, Calendar, Clock, MapPin, User } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { useState } from 'react'
import ReviewForm from './ReviewForm'

const STATUS_LABEL = {
  placed: { text: 'Placed', className: 'bg-amber/15 text-amber-dark' },
  accepted: { text: 'Accepted', className: 'bg-forest/10 text-forest' },
  ready_for_pickup: { text: 'Ready for Pickup', className: 'bg-forest text-white' },
  completed: { text: 'Completed', className: 'bg-line text-text-secondary' },
  declined: { text: 'Declined', className: 'bg-error/10 text-error' },
  cancelled: { text: 'Cancelled', className: 'bg-error/10 text-error' },
}

function ReviewButtonOrForm({ orderId }) {
  const [showForm, setShowForm] = useState(false)
  if (showForm) return <ReviewForm orderId={orderId} onDone={() => setShowForm(false)} />
  return (
    <button
      onClick={() => setShowForm(true)}
      className="w-full rounded-full border border-forest text-forest py-2.5 text-sm font-medium hover:bg-forest/5 transition-colors"
    >
      Leave a Review
    </button>
  )
}
export default function OrderDetailModal({ open, onClose, order }) {
  if (!order) return null

  const status = STATUS_LABEL[order.status]

  return (
    <Modal open={open} onClose={onClose} title={`Order #${order.id}`} size="md">
      <div className="space-y-5">
        {/* Status + farmer/market */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/10 text-forest">
              <User size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold text-text-main">{order.farmer}</p>
              <p className="text-xs text-text-secondary">{order.market}</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
            {status.text}
          </span>
        </div>

        {/* Items */}
        <div>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2.5">
            Items
          </p>
          <div className="rounded-xl bg-bg-ivory divide-y divide-line">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <Package size={13} className="text-forest shrink-0" />
                  <span className="text-sm text-text-main">
                    {item.quantity} × {item.name}
                  </span>
                </div>
                <span className="text-sm text-text-secondary">
                  Rs. {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pickup info */}
        <div>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2.5">
            Pickup Details
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-text-main">
              <Calendar size={14} className="text-forest" />
              {new Date(order.pickupDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-2 text-sm text-text-main">
              <Clock size={14} className="text-forest" />
              {order.pickupSlot}
            </div>
            <div className="flex items-center gap-2 text-sm text-text-main">
              <MapPin size={14} className="text-forest" />
              {order.market}
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-4 border-t border-line">
          <span className="text-sm font-semibold text-text-main">Total</span>
          <span className="text-lg font-semibold text-forest">Rs. {order.total}</span>
        </div>
        {order.status === 'completed' && (
          <div className="pt-2">
            <ReviewButtonOrForm orderId={order.id} />
          </div>
        )}
      </div>
    </Modal>
  )
}