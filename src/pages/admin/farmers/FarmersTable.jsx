import { useMemo, useState } from 'react'
import { useFarmers, useUpdateFarmerStatus, useDeleteFarmer } from '@/features/admin/useFarmers'
import Surface from '@/components/ui/Surface'
import Table from '@/components/ui/Table'
import SearchInput from '@/components/ui/SearchInput'
import Pagination from '@/components/ui/Pagination'
import StatusBadge from '@/components/ui/StatusBadge'
import ActionMenu from '@/components/ui/ActionMenu'
import { formatDate } from '@/lib/format'
import { Eye, CheckCircle2, Ban, Trash2 } from 'lucide-react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import FarmerDetailModal from '@/components/admin/FarmerDetailModal'

const PAGE_SIZE = 10

export default function FarmersTable() {
  const { data: farmers, isLoading, isError } = useFarmers()
  const updateStatus = useUpdateFarmerStatus()
  const deleteFarmerMutation = useDeleteFarmer()
  const [viewingFarmer, setViewingFarmer] = useState(null)
  const [deletingFarmer, setDeletingFarmer] = useState(null)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!farmers) return []
    const q = search.trim().toLowerCase()
    if (!q) return farmers
    return farmers.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.stall.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q)
    )
  }, [farmers, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <Surface className="p-5">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h2 className="font-display text-lg font-medium text-text-main">Farmers</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            {farmers?.length ?? 0} registered farmers
          </p>
        </div>
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="Search name, stall, ID…"
          className="w-64"
        />
      </div>

      {isError ? (
        <p className="text-sm text-error py-6 text-center">Couldn't load farmers.</p>
      ) : isLoading ? (
        <div className="py-10 text-center text-sm text-text-secondary">Loading farmers…</div>
      ) : paginated.length === 0 ? (
        <div className="py-10 text-center text-sm text-text-secondary">No farmers match your search.</div>
      ) : (
        <>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeadCell>Farmer</Table.HeadCell>
                <Table.HeadCell>Stall</Table.HeadCell>
                <Table.HeadCell>Markets</Table.HeadCell>
                <Table.HeadCell>Registered</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell className="text-right">Actions</Table.HeadCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginated.map((farmer) => (
                <Table.Row key={farmer.id}>
                  <Table.Cell className="font-medium text-text-main">{farmer.name}</Table.Cell>
                  <Table.Cell>{farmer.stall}</Table.Cell>
                  <Table.Cell className="text-text-secondary">{farmer.markets}</Table.Cell>
                  <Table.Cell className="text-text-secondary">{formatDate(farmer.registered)}</Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={farmer.status} />
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setViewingFarmer(farmer)}
                        className="p-1.5 rounded-md hover:bg-bg-ivory text-text-secondary"
                        aria-label="Review farmer"
                      >
                        <Eye className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                      <ActionMenu
                        actions={[
                          farmer.status !== 'approved' &&
                          {
                            label: 'Approve',
                            icon: CheckCircle2,
                            onClick: () =>
                              updateStatus.mutate({ farmerId: farmer.id, status: 'approved' }),
                          },
                          farmer.status !== 'suspended' &&
                          {
                            label: 'Suspend',
                            icon: Ban,
                            danger: true,
                            onClick: () =>
                              updateStatus.mutate({ farmerId: farmer.id, status: 'suspended' }),
                          },
                          {
                            label: 'Remove',
                            icon: Trash2,
                            danger: true,
                            onClick: () => setDeletingFarmer(farmer),
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
      <FarmerDetailModal
        farmer={viewingFarmer}
        open={!!viewingFarmer}
        onClose={() => setViewingFarmer(null)}
      />

      <ConfirmDialog
        open={!!deletingFarmer}
        onClose={() => setDeletingFarmer(null)}
        onConfirm={() => {
          deleteFarmerMutation.mutate(deletingFarmer.id)
          setDeletingFarmer(null)
        }}
        title="Remove Farmer"
        description={`Remove "${deletingFarmer?.name}"? This cannot be undone.`}
        confirmLabel="Remove"
      />
    </Surface>
  )
}