import { useEffect, useMemo, useState } from 'react'
import { useFarmerOrders, useFarmerOrderStats, useUpdateFarmerOrderStatus } from '@/features/farmer/useFarmerOrders'
import Surface from '@/components/ui/Surface'
import Stat from '@/components/ui/Stat'
import Table from '@/components/ui/Table'
import SearchInput from '@/components/ui/SearchInput'
import StatusBadge from '@/components/ui/StatusBadge'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import { useDebounce } from '@/hooks/useDebounce'
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

const STATUS_OPTIONS = [
    { value: '', label: 'All statuses' },
    { value: 'placed', label: 'Placed' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'ready_for_pickup', label: 'Ready for Pickup' },
    { value: 'completed', label: 'Completed' },
    { value: 'declined', label: 'Declined' },
    { value: 'cancelled', label: 'Cancelled' },
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
    const updateStatus = useUpdateFarmerOrderStatus()
    const [viewingOrder, setViewingOrder] = useState(null)

    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)

    const debouncedSearch = useDebounce(search, 400)

    // Reset to page 1 whenever filters change, so we don't get stuck
    // on an empty page after narrowing the result set.
    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, status])

    const queryParams = useMemo(
        () => ({ search: debouncedSearch, status, page, limit: 10 }),
        [debouncedSearch, status, page]
    )

    const { data, isLoading, isError } = useFarmerOrders(queryParams)
    const orders = data?.items ?? []
    const totalPages = data?.pages ?? 1
    const total = data?.total ?? 0

    function handleUpdateStatus(orderId, newStatus) {
        updateStatus.mutate({ orderId, status: newStatus })
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
                            {total} orders placed against your stock
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="text-sm border border-line rounded-md px-3 py-2 bg-white text-text-main"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            placeholder="Search order, customer, market…"
                            className="w-64"
                        />
                    </div>
                </div>

                {isError ? (
                    <p className="text-sm text-error py-6 text-center">Couldn't load orders.</p>
                ) : isLoading ? (
                    <div className="py-10 text-center text-sm text-text-secondary">Loading orders…</div>
                ) : orders.length === 0 ? (
                    <div className="py-10 text-center text-sm text-text-secondary">No orders match your search.</div>
                ) : (
                    <>
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
                                {orders.map((order) => (
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

                        <div className="mt-4 flex justify-end">
                            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    </>
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