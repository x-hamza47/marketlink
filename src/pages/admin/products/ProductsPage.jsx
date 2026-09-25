import { useMemo, useState } from 'react'
import { useProducts, useProductStats, useUpdateProductModeration, useDeleteProduct } from '@/features/admin/useProducts'
import Surface from '@/components/ui/Surface'
import Stat from '@/components/ui/Stat'
import Table from '@/components/ui/Table'
import SearchInput from '@/components/ui/SearchInput'
import Pagination from '@/components/ui/Pagination'
import StatusBadge from '@/components/ui/StatusBadge'
import ActionMenu from '@/components/ui/ActionMenu'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import ProductDetailModal from '@/components/admin/ProductDetailModal'
import { formatCurrency } from '@/lib/format'
import { Package, CheckCircle2, AlertTriangle, Clock3, Eye, XCircle, Trash2 } from 'lucide-react'

const PAGE_SIZE = 6

const STAT_CONFIG = [
  { key: 'total', label: 'Total Products', icon: Package },
  { key: 'available', label: 'Available', icon: CheckCircle2 },
  { key: 'lowStock', label: 'Low Stock', icon: AlertTriangle },
  { key: 'pendingModeration', label: 'Pending Moderation', icon: Clock3 },
]

function StatSkeleton() {
  return (
    <Surface className="p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-4 w-20 bg-line rounded" />
      <div className="h-8 w-14 bg-line rounded" />
    </Surface>
  )
}

export default function ProductsPage() {
  const { data: stats, isLoading: statsLoading } = useProductStats()
  const { data: products, isLoading, isError } = useProducts()
  const updateModeration = useUpdateProductModeration()
  const deleteProductMutation = useDeleteProduct()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [viewingProduct, setViewingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)

  const filtered = useMemo(() => {
    if (!products) return []
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.farmer.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    )
  }, [products, search])

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
            <h2 className="font-display text-lg font-medium text-text-main">Products</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {products?.length ?? 0} listed products across all Farmers
            </p>
          </div>
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            placeholder="Search name, Farmer, category…"
            className="w-64"
          />
        </div>

        {isError ? (
          <p className="text-sm text-error py-6 text-center">Couldn't load products.</p>
        ) : isLoading ? (
          <div className="py-10 text-center text-sm text-text-secondary">Loading products…</div>
        ) : paginated.length === 0 ? (
          <div className="py-10 text-center text-sm text-text-secondary">No products match your search.</div>
        ) : (
          <>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeadCell>Product</Table.HeadCell>
                  <Table.HeadCell>Farmer</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                  <Table.HeadCell>Price</Table.HeadCell>
                  <Table.HeadCell>Stock</Table.HeadCell>
                  <Table.HeadCell>Availability</Table.HeadCell>
                  <Table.HeadCell>Moderation</Table.HeadCell>
                  <Table.HeadCell className="text-right">Actions</Table.HeadCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paginated.map((product) => (
                  <Table.Row key={product.id}>
                    <Table.Cell className="font-medium text-text-main">{product.name}</Table.Cell>
                    <Table.Cell className="text-text-secondary">{product.farmer}</Table.Cell>
                    <Table.Cell className="text-text-secondary">{product.category}</Table.Cell>
                    <Table.Cell className="font-medium">
                      {formatCurrency(product.price)}
                      <span className="text-text-secondary font-normal"> /{product.unit}</span>
                    </Table.Cell>
                    <Table.Cell>{product.stock}</Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={product.availability} />
                    </Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={product.moderation} />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewingProduct(product)}
                          className="p-1.5 rounded-md hover:bg-bg-ivory text-text-secondary"
                          aria-label="View product"
                        >
                          <Eye className="w-4 h-4" strokeWidth={1.75} />
                        </button>
                        <ActionMenu
                          actions={[
                            product.moderation !== 'approved'
                              ? {
                                  label: 'Approve',
                                  icon: CheckCircle2,
                                  onClick: () =>
                                    updateModeration.mutate({ productId: product.id, moderation: 'approved' }),
                                }
                              : null,
                            product.moderation !== 'rejected'
                              ? {
                                  label: 'Reject',
                                  icon: XCircle,
                                  danger: true,
                                  onClick: () =>
                                    updateModeration.mutate({ productId: product.id, moderation: 'rejected' }),
                                }
                              : null,
                            {
                              label: 'Remove',
                              icon: Trash2,
                              danger: true,
                              onClick: () => setDeletingProduct(product),
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

        <ProductDetailModal
          product={viewingProduct}
          open={!!viewingProduct}
          onClose={() => setViewingProduct(null)}
        />

        <ConfirmDialog
          open={!!deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={() => {
            deleteProductMutation.mutate(deletingProduct.id)
            setDeletingProduct(null)
          }}
          title="Remove Product"
          description={`Remove "${deletingProduct?.name}"? This cannot be undone.`}
          confirmLabel="Remove"
        />
      </Surface>
    </div>
  )
}