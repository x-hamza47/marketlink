import { useMemo, useState } from 'react'
import {
  useFarmerProducts,
  useFarmerProductStats,
  useUpdateFarmerProductAvailability,
  useDeleteFarmerProduct,
} from '@/features/farmer/useFarmerProducts'
import Surface from '@/components/ui/Surface'
import Stat from '@/components/ui/Stat'
import Table from '@/components/ui/Table'
import SearchInput from '@/components/ui/SearchInput'
import ActionMenu from '@/components/ui/ActionMenu'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Button from '@/components/ui/Button'
import AddFarmerProductModal from '@/components/farmer/AddFarmerProductModal'
import { cn } from '@/lib/utils'
import { Package, CheckCircle2, XCircle, Pencil, Trash2, Plus, ImageOff } from 'lucide-react'

const STAT_CONFIG = [
  { key: 'total', label: 'Total Products', icon: Package },
  { key: 'available', label: 'Available', icon: CheckCircle2 },
  { key: 'soldOut', label: 'Sold Out', icon: XCircle },
]

const AVAILABILITY_OPTIONS = [
  { value: 'available', label: 'Available', dotClass: 'bg-success' },
  { value: 'sold_out', label: 'Sold Out', dotClass: 'bg-error' },
  { value: 'unavailable', label: 'Unavailable', dotClass: 'bg-text-secondary/50' },
]

function StatSkeleton() {
  return (
    <Surface className="p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-4 w-20 bg-line rounded" />
      <div className="h-8 w-14 bg-line rounded" />
    </Surface>
  )
}

function ProductThumb({ image }) {
  return (
    <div className="w-10 h-10 rounded-md overflow-hidden border border-line bg-bg-ivory flex items-center justify-center shrink-0">
      {image ? (
        <img src={image} alt="" className="w-full h-full object-cover" />
      ) : (
        <ImageOff className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
      )}
    </div>
  )
}

// Dropdown-style availability control — a click cycles through a small menu
// rather than a plain toggle, since there are 3 states, not 2.
function AvailabilitySelect({ value, onChange, isPending }) {
  const current = AVAILABILITY_OPTIONS.find((o) => o.value === value) || AVAILABILITY_OPTIONS[0]

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={isPending}
      className={cn(
        'text-xs font-medium rounded-full pl-2.5 pr-6 py-1 border outline-none cursor-pointer disabled:opacity-50 appearance-none bg-no-repeat',
        value === 'available'
          ? 'bg-success/10 text-success border-success/20'
          : value === 'sold_out'
          ? 'bg-error/10 text-error border-error/20'
          : 'bg-line text-text-secondary border-line'
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'><polyline points='6 9 12 15 18 9'/></svg>\")",
        backgroundPosition: 'right 8px center',
      }}
    >
      {AVAILABILITY_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default function ProductsPage() {
  const { data: stats, isLoading: statsLoading } = useFarmerProductStats()
  const { data: products, isLoading, isError } = useFarmerProducts()
  const updateAvailability = useUpdateFarmerProductAvailability()
  const deleteProductMutation = useDeleteFarmerProduct()

  const [search, setSearch] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!products) return []
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    )
  }, [products, search])

  function handleAvailabilityChange(product, availability) {
    updateAvailability.mutate({ productId: product.id, availability })
  }

  return (
    <div className="space-y-6">
      {/* Stat strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <h2 className="font-display text-lg font-medium text-text-main">My Products</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {products?.length ?? 0} products in your weekly stock
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search products…"
              className="w-56"
            />
            <Button size="sm" onClick={() => setAddModalOpen(true)}>
              <Plus className="w-4 h-4" strokeWidth={2} />
              Add
            </Button>
          </div>
        </div>

        {isError ? (
          <p className="text-sm text-error py-6 text-center">Couldn't load products.</p>
        ) : isLoading ? (
          <div className="py-10 text-center text-sm text-text-secondary">Loading products…</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-text-secondary">
            No products match your search.
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeadCell>Image</Table.HeadCell>
                <Table.HeadCell>Product</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
                <Table.HeadCell>Stock</Table.HeadCell>
                <Table.HeadCell>Availability</Table.HeadCell>
                <Table.HeadCell className="text-right">Actions</Table.HeadCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map((product) => (
                <Table.Row key={product.id}>
                  <Table.Cell>
                    <ProductThumb image={product.image} />
                  </Table.Cell>
                  <Table.Cell className="font-medium text-text-main">{product.name}</Table.Cell>
                  <Table.Cell className="text-text-secondary">{product.category}</Table.Cell>
                  <Table.Cell>
                    Rs. {product.price} <span className="text-text-secondary">/ {product.unit}</span>
                  </Table.Cell>
                  <Table.Cell>{product.stock}</Table.Cell>
                  <Table.Cell>
                    <AvailabilitySelect
                      value={product.availability}
                      onChange={(val) => handleAvailabilityChange(product, val)}
                      isPending={
                        updateAvailability.isPending &&
                        updateAvailability.variables?.productId === product.id
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-end gap-1">
                      <ActionMenu
                        actions={[
                          { label: 'Edit', icon: Pencil, onClick: () => setEditingProduct(product) },
                          {
                            label: 'Remove',
                            icon: Trash2,
                            danger: true,
                            onClick: () => setDeletingProduct(product),
                          },
                        ]}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}

        <AddFarmerProductModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />

        <AddFarmerProductModal
          open={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
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