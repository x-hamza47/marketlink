import { useMemo, useState } from 'react'
import { useRecentOrders } from '@/features/admin/useRecentOrders'
import Surface from '@/components/ui/Surface'
import Table from '@/components/ui/Table'
import SearchInput from '@/components/ui/SearchInput'
import Pagination from '@/components/ui/Pagination'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/format'
import { Eye, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react'
import ActionMenu from '@/components/ui/ActionMenu'
import { useUpdateOrderStatus, useDeleteOrder } from '@/features/admin/useOrderMutations'

const PAGE_SIZE = 5

export default function RecentOrdersTable() {
  const { data: orders, isLoading, isError } = useRecentOrders()
  const updateStatus = useUpdateOrderStatus()
  const deleteOrderMutation = useDeleteOrder()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!orders) return []
    const q = search.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.farmer.toLowerCase().includes(q)
    )
  }, [orders, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <Surface className="p-5">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h2 className="font-display text-lg font-medium text-text-main">Recent Orders</h2>
          <p className="text-xs text-text-secondary mt-0.5">Latest activity across all markets</p>
        </div>
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="Search order, customer, farmer…"
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
                      <button
                        type="button"
                        onClick={() => console.log('View order', order.id)}
                        className="p-1.5 rounded-md hover:bg-bg-ivory text-text-secondary"
                        aria-label="View order"
                      >
                        <Eye className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                      <ActionMenu
                        actions={[
                          {
                            label: 'Edit Order',
                            icon: Pencil,
                            onClick: () => console.log('Navigate to edit page for', order.id), // real nav once routing exists
                          },
                          {
                            label: 'Mark Ready',
                            icon: CheckCircle2,
                            onClick: () => updateStatus.mutate({ orderId: order.id, status: 'ready_for_pickup' }),
                          },
                          {
                            label: 'Cancel Order',
                            icon: XCircle,
                            danger: true,
                            onClick: () => updateStatus.mutate({ orderId: order.id, status: 'cancelled' }),
                          },
                          {
                            label: 'Delete',
                            icon: Trash2,
                            danger: true,
                            onClick: () => {
                              if (confirm(`Delete order #${order.id}? This cannot be undone.`)) {
                                deleteOrderMutation.mutate(order.id)
                              }
                            },
                          },
                        ]}
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
    </Surface>
  )
}