import { useMemo, useState } from 'react'
import { useOrders, useOrderStats, useUpdateOrderStatus, useDeleteOrder } from '@/features/admin/useOrders'
import Surface from '@/components/ui/Surface'
import Stat from '@/components/ui/Stat'
import Table from '@/components/ui/Table'
import SearchInput from '@/components/ui/SearchInput'
import Pagination from '@/components/ui/Pagination'
import StatusBadge from '@/components/ui/StatusBadge'
import ActionMenu from '@/components/ui/ActionMenu'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { formatCurrency, formatDate } from '@/lib/format'
import { ClipboardList, Clock3, CheckCircle2, Wallet, CheckCheck, XCircle, Trash2 } from 'lucide-react'

const PAGE_SIZE = 6

const STAT_CONFIG = [
  { key: 'total', label: 'Total Orders', icon: ClipboardList },
  { key: 'pending', label: 'Pending', icon: Clock3 },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
  { key: 'revenue', label: 'Revenue Collected', icon: Wallet, isCurrency: true },
]

function StatSkeleton() {
  return (
    <Surface className="p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-4 w-20 bg-line rounded" />
      <div className="h-8 w-14 bg-line rounded" />
    </Surface>
  )
}

export default function OrdersPage() {
  const { data: stats, isLoading: statsLoading } = useOrderStats()
  const { data: orders, isLoading, isError } = useOrders()
  const updateStatus = useUpdateOrderStatus()
  const deleteOrderMutation = useDeleteOrder()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deletingOrder, setDeletingOrder] = useState(null)

  const filtered = useMemo(() => {
    if (!orders) return []
    const q = search.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.farmer.toLowerCase().includes(q) ||
        o.market.toLowerCase().includes(q)
    )
  }, [orders, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
                value={
                  item.isCurrency
                    ? formatCurrency(stats?.[item.key] ?? 0)
                    : (stats?.[item.key] ?? 0).toLocaleString()
                }
                icon={item.icon}
              />
            ))}
      </div>

      {/* Table */}
      <Surface className="p-5">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <h2 className="font-display text-lg font-medium text-text-main">Orders</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {orders?.length ?? 0} orders across all markets
            </p>
          </div>
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            placeholder="Search order, customer, farmer, market…"
            className="w-64"
          />
        </div>

        {isError ? (
          <p className="text-sm text-error py-6 text-center">Couldn't load orders.</p>
        ) : isLoading ? (
          <div className="py-10 text-center text-sm text-text-secondary">Loading orders…</div>
        ) : paginated.length === 0 ? (
          <div className="py-10 text-center text-sm text-text-secondary">No orders match your search.</div>
        ) : (
          <>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeadCell>Order</Table.HeadCell>
                  <Table.HeadCell>Customer</Table.HeadCell>
                  <Table.HeadCell>Farmer</Table.HeadCell>
                  <Table.HeadCell>Market</Table.HeadCell>
                  <Table.HeadCell>Items</Table.HeadCell>
                  <Table.HeadCell>Total</Table.HeadCell>
                  <Table.HeadCell>Pickup</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell className="text-right">Actions</Table.HeadCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paginated.map((order) => (
                  <Table.Row key={order.id}>
                    <Table.Cell className="font-medium text-forest">#{order.id}</Table.Cell>
                    <Table.Cell>{order.customer}</Table.Cell>
                    <Table.Cell>{order.farmer}</Table.Cell>
                    <Table.Cell className="text-text-secondary">{order.market}</Table.Cell>
                    <Table.Cell>{order.items}</Table.Cell>
                    <Table.Cell className="font-medium">{formatCurrency(order.total)}</Table.Cell>
                    <Table.Cell className="text-text-secondary">{formatDate(order.pickupDate)}</Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={order.status} />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-end gap-1">
                        <ActionMenu
                          actions={[
                            order.status !== 'ready_for_pickup' && order.status !== 'completed'
                              ? {
                                  label: 'Mark Ready',
                                  icon: CheckCheck,
                                  onClick: () =>
                                    updateStatus.mutate({ orderId: order.id, status: 'ready_for_pickup' }),
                                }
                              : null,
                            order.status !== 'completed'
                              ? {
                                  label: 'Mark Completed',
                                  icon: CheckCircle2,
                                  onClick: () =>
                                    updateStatus.mutate({ orderId: order.id, status: 'completed' }),
                                }
                              : null,
                            order.status !== 'cancelled'
                              ? {
                                  label: 'Cancel Order',
                                  icon: XCircle,
                                  danger: true,
                                  onClick: () =>
                                    updateStatus.mutate({ orderId: order.id, status: 'cancelled' }),
                                }
                              : null,
                            {
                              label: 'Delete',
                              icon: Trash2,
                              danger: true,
                              onClick: () => setDeletingOrder(order),
                            },
                          ].filter(Boolean)}
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />
          </>
        )}

        <ConfirmDialog
          open={!!deletingOrder}
          onClose={() => setDeletingOrder(null)}
          onConfirm={() => {
            deleteOrderMutation.mutate(deletingOrder.id)
            setDeletingOrder(null)
          }}
          title="Delete Order"
          description={`Delete order #${deletingOrder?.id}? This cannot be undone.`}
          confirmLabel="Delete"
        />
      </Surface>
    </div>
  )
}