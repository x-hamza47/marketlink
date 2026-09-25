import { useMemo, useState } from 'react'
import { useUpdateCustomerStatus, useDeleteCustomer, useCustomers, useCustomerStats } from '@/features/admin/useCustomers'
import Surface from '@/components/ui/Surface'
import Stat from '@/components/ui/Stat'
import Table from '@/components/ui/Table'
import SearchInput from '@/components/ui/SearchInput'
import Pagination from '@/components/ui/Pagination'
import StatusBadge from '@/components/ui/StatusBadge'
import ActionMenu from '@/components/ui/ActionMenu'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import CustomerDetailModal from '@/components/admin/CustomerDetailModal'
import { formatDate } from '@/lib/format'
import { Users, UserCheck, UserX, ShoppingBag, Eye, Ban, CheckCircle2, Trash2 } from 'lucide-react'

const PAGE_SIZE = 6

const STAT_CONFIG = [
  { key: 'total', label: 'Total Customers', icon: Users },
  { key: 'active', label: 'Active', icon: UserCheck },
  { key: 'inactive', label: 'Inactive', icon: UserX },
  { key: 'totalOrders', label: 'Total Orders Placed', icon: ShoppingBag },
]

function StatSkeleton() {
  return (
    <Surface className="p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-4 w-20 bg-line rounded" />
      <div className="h-8 w-14 bg-line rounded" />
    </Surface>
  )
}

export default function CustomersPage() {
  const { data: stats, isLoading: statsLoading } = useCustomerStats()
  const { data: customers, isLoading, isError } = useCustomers()
  const updateStatus = useUpdateCustomerStatus()
  const deleteCustomerMutation = useDeleteCustomer()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [viewingCustomer, setViewingCustomer] = useState(null)
  const [deletingCustomer, setDeletingCustomer] = useState(null)

  const filtered = useMemo(() => {
    if (!customers) return []
    const q = search.trim().toLowerCase()
    if (!q) return customers
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    )
  }, [customers, search])

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
                value={(stats?.[item.key] ?? 0).toLocaleString()}
                icon={item.icon}
              />
            ))}
      </div>

      {/* Table */}
      <Surface className="p-5">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <h2 className="font-display text-lg font-medium text-text-main">Customers</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {customers?.length ?? 0} registered customers
            </p>
          </div>
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            placeholder="Search name, email, ID…"
            className="w-64"
          />
        </div>

        {isError ? (
          <p className="text-sm text-error py-6 text-center">Couldn't load customers.</p>
        ) : isLoading ? (
          <div className="py-10 text-center text-sm text-text-secondary">Loading customers…</div>
        ) : paginated.length === 0 ? (
          <div className="py-10 text-center text-sm text-text-secondary">No customers match your search.</div>
        ) : (
          <>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeadCell>Customer</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Phone</Table.HeadCell>
                  <Table.HeadCell>Orders</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>Joined</Table.HeadCell>
                  <Table.HeadCell className="text-right">Actions</Table.HeadCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paginated.map((customer) => (
                  <Table.Row key={customer.id}>
                    <Table.Cell className="font-medium text-text-main">{customer.name}</Table.Cell>
                    <Table.Cell className="text-text-secondary">{customer.email}</Table.Cell>
                    <Table.Cell className="text-text-secondary">{customer.phone}</Table.Cell>
                    <Table.Cell>{customer.orders}</Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={customer.status} />
                    </Table.Cell>
                    <Table.Cell className="text-text-secondary">{formatDate(customer.joined)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewingCustomer(customer)}
                          className="p-1.5 rounded-md hover:bg-bg-ivory text-text-secondary"
                          aria-label="View customer"
                        >
                          <Eye className="w-4 h-4" strokeWidth={1.75} />
                        </button>
                        <ActionMenu
                          actions={[
                            customer.status === 'active'
                              ? {
                                  label: 'Deactivate',
                                  icon: Ban,
                                  danger: true,
                                  onClick: () =>
                                    updateStatus.mutate({ customerId: customer.id, status: 'inactive' }),
                                }
                              : {
                                  label: 'Activate',
                                  icon: CheckCircle2,
                                  onClick: () =>
                                    updateStatus.mutate({ customerId: customer.id, status: 'active' }),
                                },
                            {
                              label: 'Remove',
                              icon: Trash2,
                              danger: true,
                              onClick: () => setDeletingCustomer(customer),
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

        <CustomerDetailModal
          customer={viewingCustomer}
          open={!!viewingCustomer}
          onClose={() => setViewingCustomer(null)}
        />

        <ConfirmDialog
          open={!!deletingCustomer}
          onClose={() => setDeletingCustomer(null)}
          onConfirm={() => {
            deleteCustomerMutation.mutate(deletingCustomer.id)
            setDeletingCustomer(null)
          }}
          title="Remove Customer"
          description={`Remove "${deletingCustomer?.name}"? This cannot be undone.`}
          confirmLabel="Remove"
        />
      </Surface>
    </div>
  )
}