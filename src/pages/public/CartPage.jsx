import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { placeOrder, getFarmerProfile } from '@/services/publicService'
import { toast } from 'sonner'

const DAY_LABELS = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' }

// Next upcoming calendar date for a given weekday short-code, within next 7 days
function nextDateForDay(dayCode) {
  const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(dayCode)
  if (dayIndex === -1) return null
  const today = new Date()
  const diff = (dayIndex - today.getDay() + 7) % 7
  const date = new Date(today)
  date.setDate(today.getDate() + (diff === 0 ? 7 : diff)) // next occurrence, not today
  return date
}

export default function CartPage() {
  const { items, market, farmerId, updateQuantity, removeItem, getTotalPrice, clearCart, setMarket } = useCartStore()
  const { user } = useAuthStore()

  const [availableMarkets, setAvailableMarkets] = useState([])
  const pickupDays = market?.operatingDays || []
  const [selectedDay, setSelectedDay] = useState(pickupDays[0] || '')
  const [notes, setNotes] = useState('')
  const [isPlacing, setIsPlacing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(null)

  // Fetch farmer's markets if not loaded or to provide switching
  useEffect(() => {
    if (farmerId) {
      getFarmerProfile(farmerId)
        .then((profile) => {
          if (profile?.markets?.length > 0) {
            const mappedList = profile.markets.map((m) => ({
              marketId: m.marketId?._id || m.marketId,
              marketName: m.marketId?.name || '',
              marketAddress: m.marketId?.address || '',
              operatingDays: m.operatingDays || [],
              pickupStart: m.pickupStart || '',
              pickupEnd: m.pickupEnd || '',
              cutoffHours: m.cutoffHours || 12,
            }))
            setAvailableMarkets(mappedList)
            if (!market || !market.marketId) {
              setMarket(mappedList[0])
            }
          }
        })
        .catch(() => {})
    }
  }, [farmerId, market, setMarket])

  // Sync selectedDay whenever pickupDays change
  useEffect(() => {
    if (pickupDays.length > 0 && (!selectedDay || !pickupDays.includes(selectedDay))) {
      setSelectedDay(pickupDays[0])
    }
  }, [pickupDays, selectedDay])

  const subtotal = getTotalPrice()

  const selectedDate = useMemo(
    () => (selectedDay ? nextDateForDay(selectedDay) : null),
    [selectedDay]
  )

  const handlePlaceOrder = async () => {
    const resolvedMarketId = market?.marketId || market?._id || market?.id
    if (!market || !resolvedMarketId || !selectedDay) {
      toast.error('Please select a pickup market and day')
      return
    }

    const pickupStart = market.pickupStart || '09:00'
    const pickupEnd = market.pickupEnd || '17:00'

    setIsPlacing(true)
    try {
      const order = await placeOrder({
        farmerId,
        marketId: resolvedMarketId,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        pickupDate: selectedDate,
        pickupWindow: { startTime: pickupStart, endTime: pickupEnd },
        notes,
      })
      setOrderPlaced(order)
      clearCart()
      toast.success('Order placed successfully!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not place order. Try again.')
    } finally {
      setIsPlacing(false)
    }
  }

  // Success state — after order is placed
  if (orderPlaced) {
    return (
      <div className="bg-bg-ivory min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center bg-surface-cream border border-line rounded-3xl p-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-forest mx-auto mb-4">
            <CheckCircle2 size={28} />
          </span>
          <h1 className="font-display text-xl font-semibold text-text-main mb-2">
            Order Placed!
          </h1>
          <p className="text-sm text-text-secondary mb-5">
            Your order <span className="font-medium text-text-main">#{orderPlaced.id}</span> has
            been sent to the farmer for confirmation.
          </p>

          <div className="rounded-xl bg-bg-ivory p-4 text-left space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} className="text-forest" />
              <span className="text-text-main">{new Date(orderPlaced.pickupDate).toDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} className="text-forest" />
              <span className="text-text-main">{orderPlaced.pickupSlot}</span>
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-line">
              <span className="text-text-secondary">Total (pay at pickup)</span>
              <span className="font-semibold text-forest">Rs. {orderPlaced.total}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/account/orders"
              className="rounded-full bg-forest py-2.5 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
            >
              View My Orders
            </Link>
            <Link
              to="/products"
              className="rounded-full border border-line py-2.5 text-sm font-medium text-text-main hover:border-forest transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="bg-bg-ivory min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest mx-auto mb-4">
            <ShoppingBag size={28} />
          </span>
          <h1 className="font-display text-xl font-semibold text-text-main mb-2">
            Your cart is empty
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            Browse fresh products from local farmers and add some to your cart.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
          >
            Explore Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-ivory min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        <h1 className="font-display text-3xl font-semibold text-text-main mb-8">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* Left: cart items + pickup details */}
          <div className="space-y-6">
            {/* Cart items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-surface-cream p-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-main truncate">{item.name}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{item.farmer}</p>
                    <p className="text-sm font-semibold text-forest mt-1.5">
                      Rs. {item.price} / {item.unit}
                    </p>
                  </div>

                  <div className="flex items-center rounded-full border border-line overflow-hidden shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-9 w-9 flex items-center justify-center text-text-main hover:bg-bg-ivory"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-9 w-9 flex items-center justify-center text-text-main hover:bg-bg-ivory"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-text-main w-20 text-right shrink-0">
                    Rs. {item.price * item.quantity}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-text-secondary hover:text-error transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>

            {/* Pickup market info */}
            <div className="rounded-2xl border border-line bg-surface-cream p-5">
              <p className="text-sm font-semibold text-text-main mb-2 flex items-center gap-2">
                <MapPin size={15} className="text-forest" />
                Pickup Market
              </p>
              {availableMarkets.length > 1 ? (
                <div className="space-y-2">
                  <select
                    value={market?.marketId || ''}
                    onChange={(e) => {
                      const found = availableMarkets.find((m) => m.marketId === e.target.value)
                      if (found) setMarket(found)
                    }}
                    className="w-full rounded-xl border border-line bg-bg-ivory px-3 py-2 text-sm text-text-main outline-none focus:border-forest"
                  >
                    {availableMarkets.map((m) => (
                      <option key={m.marketId} value={m.marketId}>
                        {m.marketName || m.marketAddress}
                      </option>
                    ))}
                  </select>
                  {market?.marketAddress && (
                    <p className="text-xs text-text-secondary">{market.marketAddress}</p>
                  )}
                </div>
              ) : market ? (
                <p className="text-sm text-text-secondary">{market.marketName || market.marketAddress}</p>
              ) : (
                <p className="text-sm text-text-secondary">Loading market details…</p>
              )}
            </div>

            {/* Pickup day */}
            <div className="rounded-2xl border border-line bg-surface-cream p-5">
              <p className="text-sm font-semibold text-text-main mb-3 flex items-center gap-2">
                <Calendar size={15} className="text-forest" />
                Pickup Day
              </p>
              <div className="flex flex-wrap gap-2">
                {pickupDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`rounded-full px-4 py-2 text-sm border transition-colors ${
                      selectedDay === day
                        ? 'bg-forest text-white border-forest'
                        : 'border-line text-text-main hover:border-forest'
                    }`}
                  >
                    {DAY_LABELS[day] || day}
                  </button>
                ))}
              </div>
              {selectedDate && (
                <p className="text-xs text-text-secondary mt-3">
                  Next pickup: {selectedDate.toDateString()}
                </p>
              )}
            </div>

            {/* Pickup time (fixed by farmer for this market) */}
            {market?.pickupStart && (
              <div className="rounded-2xl border border-line bg-surface-cream p-5">
                <p className="text-sm font-semibold text-text-main mb-2 flex items-center gap-2">
                  <Clock size={15} className="text-forest" />
                  Pickup Time
                </p>
                <p className="text-sm text-text-secondary">
                  {market.pickupStart} – {market.pickupEnd}
                </p>
              </div>
            )}

            {/* Notes */}
            <div className="rounded-2xl border border-line bg-surface-cream p-5">
              <p className="text-sm font-semibold text-text-main mb-3">Notes (optional)</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any special instructions for the farmer..."
                className="w-full rounded-lg border border-line bg-bg-ivory px-3 py-2.5 text-sm outline-none focus:border-forest resize-none"
              />
            </div>
          </div>

          {/* Right: order summary (sticky) */}
          <div className="rounded-2xl border border-line bg-surface-cream p-5 h-fit sticky top-24">
            <p className="text-sm font-semibold text-text-main mb-4">Order Summary</p>

            <div className="space-y-3 mb-4 pb-4 border-b border-line max-h-52 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-text-main truncate max-w-[160px]">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="text-text-secondary shrink-0">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-1">
              <span className="text-sm text-text-secondary">Subtotal</span>
              <span className="text-sm text-text-main font-medium">Rs. {subtotal}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-text-secondary">Pickup fee</span>
              <span className="text-sm text-text-main font-medium">Free</span>
            </div>
            <div className="flex justify-between mb-5 pt-2 border-t border-line">
              <span className="text-sm font-semibold text-text-main">Total</span>
              <span className="text-lg font-semibold text-forest">Rs. {subtotal}</span>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isPlacing || !selectedDay}
              className="w-full rounded-full bg-forest py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors disabled:opacity-60"
            >
              {isPlacing ? 'Placing Order...' : 'Place Order'}
            </button>

            <p className="text-[11px] text-text-secondary text-center mt-3 flex items-center justify-center gap-1">
              <MapPin size={11} />
              Payment collected at pickup — no card required.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}