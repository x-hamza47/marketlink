import { useMemo, useState } from 'react'
import { useCategories, useCategoryStats, useUpdateCategoryStatus, useDeleteCategory } from '@/features/admin/useCategories'
import Surface from '@/components/ui/Surface'
import Stat from '@/components/ui/Stat'
import Table from '@/components/ui/Table'
import SearchInput from '@/components/ui/SearchInput'
import ActionMenu from '@/components/ui/ActionMenu'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Button from '@/components/ui/Button'
import CategoryDetailModal from '@/components/admin/CategoryDetailModal'
import AddCategoryModal from '@/components/admin/AddCategoryModal'
import { cn } from '@/lib/utils'
import {
  Tags,
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
  Trash2,
  Plus,
  ImageOff,
  List,
  LayoutGrid,
} from 'lucide-react'

const STAT_CONFIG = [
  { key: 'total', label: 'Total Categories', icon: Tags },
  { key: 'active', label: 'Active', icon: CheckCircle2 },
  { key: 'inactive', label: 'Inactive', icon: XCircle },
]

function StatSkeleton() {
  return (
    <Surface className="p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-4 w-20 bg-line rounded" />
      <div className="h-8 w-14 bg-line rounded" />
    </Surface>
  )
}

// Table-row / grid-card inline status switch — a click toggles active/inactive
// directly, no need to open the ActionMenu for the thing admins do most often.
function StatusSwitch({ status, onToggle, isPending }) {
  const isActive = status === 'active'
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isPending}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors disabled:opacity-50',
        isActive
          ? 'bg-success/10 text-success border border-success/20 hover:bg-success/15'
          : 'bg-line text-text-secondary hover:bg-line/70'
      )}
      title={isActive ? 'Click to deactivate' : 'Click to activate'}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', isActive ? 'bg-success' : 'bg-text-secondary/50')} />
      {isActive ? 'Active' : 'Inactive'}
    </button>
  )
}

function CategoryThumb({ image, className }) {
  return (
    <div className={cn('rounded-md overflow-hidden border border-line bg-bg-ivory flex items-center justify-center shrink-0', className)}>
      {image ? (
        <img src={image} alt="" className="w-full h-full object-cover" />
      ) : (
        <ImageOff className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
      )}
    </div>
  )
}

export default function CategoriesPage() {
  const { data: stats, isLoading: statsLoading } = useCategoryStats()
  const { data: categories, isLoading, isError } = useCategories()
  const updateStatus = useUpdateCategoryStatus()
  const deleteCategoryMutation = useDeleteCategory()

  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('table') // 'table' | 'grid'
  const [viewingCategory, setViewingCategory] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!categories) return []
    const q = search.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((c) => c.name.toLowerCase().includes(q))
  }, [categories, search])

  function toggleStatus(category) {
    updateStatus.mutate({
      categoryId: category.id,
      status: category.status === 'active' ? 'inactive' : 'active',
    })
  }

  const rowActions = (category) => [
    { label: 'Edit', icon: Pencil, onClick: () => setEditingCategory(category) },
    { label: 'Remove', icon: Trash2, danger: true, onClick: () => setDeletingCategory(category) },
  ]

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
            <h2 className="font-display text-lg font-medium text-text-main">Categories</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {categories?.length ?? 0} product categories
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search categories…"
              className="w-56"
            />

            {/* View toggle */}
            <div className="inline-flex items-center bg-bg-ivory border border-line rounded-md p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-label="Table view"
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'table' ? 'bg-forest text-white' : 'text-text-secondary hover:text-text-main'
                )}
              >
                <List className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'grid' ? 'bg-forest text-white' : 'text-text-secondary hover:text-text-main'
                )}
              >
                <LayoutGrid className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <Button size="sm" onClick={() => setAddModalOpen(true)}>
              <Plus className="w-4 h-4" strokeWidth={2} />
              Add
            </Button>
          </div>
        </div>

        {isError ? (
          <p className="text-sm text-error py-6 text-center">Couldn't load categories.</p>
        ) : isLoading ? (
          <div className="py-10 text-center text-sm text-text-secondary">Loading categories…</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-text-secondary">
            No categories match your search.
          </div>
        ) : viewMode === 'table' ? (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeadCell>Image</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell className="text-right">Actions</Table.HeadCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map((category) => (
                <Table.Row key={category.id}>
                  <Table.Cell>
                    <CategoryThumb image={category.image} className="w-10 h-10" />
                  </Table.Cell>
                  <Table.Cell className="font-medium text-text-main">{category.name}</Table.Cell>
                  <Table.Cell>
                    <StatusSwitch
                      status={category.status}
                      onToggle={() => toggleStatus(category)}
                      isPending={updateStatus.isPending && updateStatus.variables?.categoryId === category.id}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setViewingCategory(category)}
                        className="p-1.5 rounded-md hover:bg-bg-ivory text-text-secondary"
                        aria-label="View category"
                      >
                        <Eye className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                      <ActionMenu actions={rowActions(category)} />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((category) => (
              <Surface key={category.id} className="overflow-hidden group relative">
                <div className="h-32">
                  <CategoryThumb image={category.image} className="w-full h-full rounded-none border-0" />
                </div>

                <button
                  type="button"
                  onClick={() => setViewingCategory(category)}
                  className="absolute top-2 left-2 p-1.5 rounded-md bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="View category"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ActionMenu actions={rowActions(category)} />
                </div>

                <div className="p-3 space-y-1.5">
                  <p className="text-sm font-medium text-text-main truncate">{category.name}</p>
                  <StatusSwitch
                    status={category.status}
                    onToggle={() => toggleStatus(category)}
                    isPending={updateStatus.isPending && updateStatus.variables?.categoryId === category.id}
                  />
                </div>
              </Surface>
            ))}
          </div>
        )}

        <CategoryDetailModal
          category={viewingCategory}
          open={!!viewingCategory}
          onClose={() => setViewingCategory(null)}
        />

        <AddCategoryModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />

        <AddCategoryModal
          open={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          category={editingCategory}
        />

        <ConfirmDialog
          open={!!deletingCategory}
          onClose={() => setDeletingCategory(null)}
          onConfirm={() => {
            deleteCategoryMutation.mutate(deletingCategory.id)
            setDeletingCategory(null)
          }}
          title="Remove Category"
          description={`Remove "${deletingCategory?.name}"? This cannot be undone.`}
          confirmLabel="Remove"
        />
      </Surface>
    </div>
  )
} 