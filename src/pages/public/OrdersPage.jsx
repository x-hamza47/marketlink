import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ShoppingBag,
  X,
} from 'lucide-react'
import { useCustomerOrders, useCancelOrder } from '@/features/public/useOrders'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import OrderDetailModal from '@/components/public/OrderDetailModal'
import clsx from 'clsx'

const STATUS_LABEL = {
  placed: { text: 'Placed', className: 'bg-amber/15 text-amber-dark' },
  accepted: { text: 'Accepted', className: 'bg-forest/10 text-forest' },
  ready_for_pickup: { text: 'Ready for Pickup', className: 'bg-forest text-white' },
  completed: { text: 'Completed', className: 'bg-line text-text-secondary' },
  declined: { text: 'Declined', className: 'bg-error/10 text-error' },
  cancelled: { text: 'Cancelled', className: 'bg-error/10 text-error' },
}

const FILTER_TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'declined', label: 'Declined/Cancelled' },
]

function isActive(status) {
  return ['placed', 'accepted', 'ready_for_pickup'].includes(status)
}

function canCancel(order) {
  if (!isActive(order.status)) return false
  return new Date() < new Date(order.cutoffTime)
}

function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-surface-cream p-4 sm:p-5 animate-pulse">
      <div className="h-4 w-1/3 bg-line rounded mb-3" />
      <div className="h-3 w-1/2 bg-line rounded mb-2" />
      <div className="h-3 w-2/3 bg-line rounded" />
    </div>
  )
}

export default function OrdersPage() {
  const { data: orders, isLoading, isError } = useCustomerOrders()
  const cancelOrder = useCancelOrder()

  const [activeFilter, setActiveFilter] = useState('all')
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [orderToView, setOrderToView] = useState(null)

  const filteredOrders = orders?.filter((order) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'active') return isActive(order.status)
    if (activeFilter === 'completed') return order.status === 'completed'
    if (activeFilter === 'declined') return ['declined', 'cancelled'].includes(order.status)
    return true
  })

  const handleConfirmCancel = () => {
    if (orderToCancel) {
      cancelOrder.mutate(orderToCancel.id)
      setOrderToCancel(null)
    }
  }

  return (
    <div className="bg-bg-ivory min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-14">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-text-main mb-1.5 sm:mb-2">
            My Orders
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm lg:text-base">
            Track your pre-orders and pickup status.
          </p>
        </div>

        <div className="flex gap-2 mb-5 sm:mb-6 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={clsx(
                'shrink-0 rounded-full px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium border transition-colors whitespace-nowrap',
                activeFilter === tab.value
                  ? 'bg-forest text-white border-forest'
                  : 'border-line text-text-secondary hover:border-forest'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isError ? (
          <p className="text-sm text-error text-center py-16">Couldn't load your orders right now.</p>
        ) : isLoading ? (
          <div className="space-y-3 sm:space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)}
          </div>
        ) : !filteredOrders || filteredOrders.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-forest/10 text-forest mx-auto mb-4">
              <ShoppingBag size={24} className="sm:hidden" />
              <ShoppingBag size={28} className="hidden sm:block" />
            </span>
            <p className="text-text-main font-medium mb-1 text-sm sm:text-base">No orders here yet</p>
            <p className="text-xs sm:text-sm text-text-secondary mb-6">
              {activeFilter === 'all'
                ? "You haven't placed any orders yet."
                : 'Nothing matches this filter.'}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white hover:bg-forest-dark transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredOrders.map((order) => {
              const status = STATUS_LABEL[order.status]
              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-line bg-surface-cream p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-text-main truncate">
                        #{order.id}
                      </p>
                      <p className="text-[11px] sm:text-xs text-text-secondary mt-0.5 truncate">
                        {order.farmer} · {order.market}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold ${status.className}`}>
                      {status.text}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 mb-3 text-xs sm:text-sm text-text-secondary">
                    <Package size={13} className="mt-0.5 shrink-0 text-forest sm:size-[14px]" />
                    <p className="leading-snug">
                      {order.items.map((item, i) => (
                        <span key={i}>
                          {item.quantity} × {item.name}
                          {i < order.items.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs text-text-secondary mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {new Date(order.pickupDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {order.pickupSlot}
                    </span>
                    <span className="flex items-center gap-1.5 min-w-0">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate">{order.market}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-line">
                    <span className="text-sm sm:text-base font-semibold text-forest shrink-0">
                      Rs. {order.total}
                    </span>

                    <div className="flex items-center gap-3 sm:gap-4">
                      {canCancel(order) && (
                        <button
                          onClick={() => setOrderToCancel(order)}
                          className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-error hover:underline whitespace-nowrap"
                        >
                          <X size={12} />
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => setOrderToView(order)}
                        className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-forest hover:underline whitespace-nowrap"
                      >
                        Details
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <OrderDetailModal
        open={!!orderToView}
        onClose={() => setOrderToView(null)}
        order={orderToView}
      />

      <ConfirmDialog
        open={!!orderToCancel}
        onClose={() => setOrderToCancel(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel this order?"
        description={`This will cancel order #${orderToCancel?.id}. This action can't be undone.`}
        confirmLabel="Cancel Order"
        danger
      />
    </div>
  )
}