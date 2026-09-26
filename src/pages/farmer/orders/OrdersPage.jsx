import { useMemo, useState } from 'react'
import { useFarmerOrders, useFarmerOrderStats, useUpdateFarmerOrderStatus } from '@/features/farmer/useFarmerOrders'
import Surface from '@/components/ui/Surface'
import Stat from '@/components/ui/Stat'
import Table from '@/components/ui/Table'
import SearchInput from '@/components/ui/SearchInput'
import StatusBadge from '@/components/ui/StatusBadge'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/format'
import {
    ClipboardList,
    Clock,
    PackageCheck,
    CheckCircle2,
    Check,
    X,
    Eye,
} from 'lucide-react'
import OrderDetailModal from '@/components/farmer/OrderDetailModal'

const STAT_CONFIG = [
    { key: 'total', label: 'Total Orders', icon: ClipboardList },
    { key: 'pending', label: 'Awaiting Response', icon: Clock },
    { key: 'readyForPickup', label: 'Ready for Pickup', icon: PackageCheck },
    { key: 'completed', label: 'Completed', icon: CheckCircle2 },
]

function StatSkeleton() {
    return (
        <Surface className="p-5 flex flex-col gap-3 animate-pulse">
            <div className="h-4 w-20 bg-line rounded" />
            <div className="h-8 w-14 bg-line rounded" />
        </Surface>
    )
}

// Renders only the actions valid for the order's current status —
// a "placed" order shows Accept/Decline, an "accepted" one shows
// Mark Ready, etc. Prevents nonsensical state jumps from the UI side.
function OrderActions({ order, onUpdateStatus, isPending }) {
    if (order.status === 'placed') {
        return (
            <div className="flex items-center justify-end gap-1.5">
                <Button
                    size="sm"
                    variant="secondary"
                    disabled={isPending}
                    onClick={() => onUpdateStatus(order.id, 'declined')}
                >
                    <X className="w-3.5 h-3.5" />
                    Decline
                </Button>
                <Button size="sm" disabled={isPending} onClick={() => onUpdateStatus(order.id, 'accepted')}>
                    <Check className="w-3.5 h-3.5" />
                    Accept
                </Button>
            </div>
        )
    }

    if (order.status === 'accepted') {
        return (
            <div className="flex justify-end">
                <Button size="sm" disabled={isPending} onClick={() => onUpdateStatus(order.id, 'ready_for_pickup')}>
                    <PackageCheck className="w-3.5 h-3.5" />
                    Mark Ready
                </Button>
            </div>
        )
    }

    if (order.status === 'ready_for_pickup') {
        return (
            <div className="flex justify-end">
                <Button size="sm" disabled={isPending} onClick={() => onUpdateStatus(order.id, 'completed')}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Completed
                </Button>
            </div>
        )
    }

    // completed / declined / cancelled — nothing left to do
    return <span className="text-xs text-text-secondary">—</span>
}

export default function OrdersPage() {
    const { data: stats, isLoading: statsLoading } = useFarmerOrderStats()
    const { data: orders, isLoading, isError } = useFarmerOrders()
    const updateStatus = useUpdateFarmerOrderStatus()
    const [viewingOrder, setViewingOrder] = useState(null)

    const [search, setSearch] = useState('')

    const filtered = useMemo(() => {
        if (!orders) return []
        const q = search.trim().toLowerCase()
        if (!q) return orders
        return orders.filter(
            (o) =>
                o.id.toLowerCase().includes(q) ||
                o.customer.toLowerCase().includes(q) ||
                o.market.toLowerCase().includes(q)
        )
    }, [orders, search])

    function handleUpdateStatus(orderId, status) {
        updateStatus.mutate({ orderId, status })
    }

    return (
        <div className="space-y-6">
            {/* Stat strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statsLoading
                    ? STAT_CONFIG.map((item) => <StatSkeleton key={item.key} />)
                    : STAT_CONFIG.map((item) => (
                        <Stat
                            key={item.key}
                            label={item.label}
                            value={(stats?.[item.key] ?? 0).toLocaleString()}
                            icon={item.icon}
                        />
                    ))}
            </div>

            <Surface className="p-5">
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                    <div>
                        <h2 className="font-display text-lg font-medium text-text-main">Pre-Orders</h2>
                        <p className="text-xs text-text-secondary mt-0.5">
                            {orders?.length ?? 0} orders placed against your stock
                        </p>
                    </div>
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search order, customer, market…"
                        className="w-64"
                    />
                </div>

                {isError ? (
                    <p className="text-sm text-error py-6 text-center">Couldn't load orders.</p>
                ) : isLoading ? (
                    <div className="py-10 text-center text-sm text-text-secondary">Loading orders…</div>
                ) : filtered.length === 0 ? (
                    <div className="py-10 text-center text-sm text-text-secondary">No orders match your search.</div>
                ) : (
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeadCell>Order</Table.HeadCell>
                                <Table.HeadCell>Customer</Table.HeadCell>
                                <Table.HeadCell>Market</Table.HeadCell>
                                <Table.HeadCell>Items</Table.HeadCell>
                                <Table.HeadCell>Total</Table.HeadCell>
                                <Table.HeadCell>Pickup</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                                <Table.HeadCell className="text-right">Actions</Table.HeadCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {filtered.map((order) => (
                                <Table.Row key={order.id}>
                                    <Table.Cell className="font-medium text-forest">#{order.id}</Table.Cell>
                                    <Table.Cell>{order.customer}</Table.Cell>
                                    <Table.Cell className="text-text-secondary">{order.market}</Table.Cell>
                                    <Table.Cell className="text-text-secondary">
                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                    </Table.Cell>
                                    <Table.Cell className="font-medium">Rs. {order.total.toLocaleString()}</Table.Cell>
                                    <Table.Cell className="text-text-secondary">
                                        {formatDate(order.pickupDate)}
                                        <span className="block text-xs">{order.pickupSlot}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <StatusBadge status={order.status} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setViewingOrder(order)}
                                                className="p-1.5 rounded-md hover:bg-bg-ivory text-text-secondary"
                                                aria-label="View order details"
                                            >
                                                <Eye className="w-4 h-4" strokeWidth={1.75} />
                                            </button>
                                            <OrderActions
                                                order={order}
                                                onUpdateStatus={handleUpdateStatus}
                                                isPending={updateStatus.isPending && updateStatus.variables?.orderId === order.id}
                                            />
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </Surface>
            <OrderDetailModal
  order={viewingOrder}
  open={!!viewingOrder}
  onClose={() => setViewingOrder(null)}
/>
        </div>
    )
}