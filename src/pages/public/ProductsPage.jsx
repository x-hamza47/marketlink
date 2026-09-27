import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useProducts, usePublicCategories } from '@/features/public/useProducts'
import { useDebounce } from '@/hooks/useDebounce'
import ProductCard from '@/components/public/ProductCard'
import clsx from 'clsx'

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-surface-cream overflow-hidden animate-pulse">
      <div className="h-40 bg-line" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 bg-line rounded" />
        <div className="h-3 w-1/2 bg-line rounded" />
        <div className="h-4 w-1/3 bg-line rounded" />
      </div>
    </div>
  )
}

const SORT_OPTIONS = [
  { value: '', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

export default function ProductsPage() {
  const [params, setParams] = useSearchParams()

  const search = params.get('search') || ''
  const category = params.get('category') || ''
  const maxPrice = params.get('maxPrice') || ''
  const inStockOnly = params.get('inStockOnly') === 'true'
  const sort = params.get('sort') || ''
  const page = Number(params.get('page')) || 1

  const debouncedSearch = useDebounce(search, 400)

  // Any filter change (not page) resets back to page 1
  function updateParams(patch, resetPage = true) {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([key, value]) => {
      if (value === '' || value === false || value == null) next.delete(key)
      else next.set(key, String(value))
    })
    if (resetPage) next.delete('page')
    setParams(next, { replace: true })
  }

  const { data: categories } = usePublicCategories()
  const { data, isLoading, isError, isFetching } = useProducts({
    search: debouncedSearch,
    category,
    maxPrice,
    inStockOnly,
    sort,
    page,
  })

  const products = data?.items ?? []
  const totalPages = data?.pages ?? 1

  // If a filter change makes the current page invalid, snap back to page 1
  useEffect(() => {
    if (data && page > data.pages && data.pages > 0) {
      updateParams({ page: 1 }, false)
    }
  }, [data])

  const activeFilterCount = [category, maxPrice, inStockOnly].filter(Boolean).length

  const clearFilters = () => {
    updateParams({ category: '', maxPrice: '', inStockOnly: '' })
  }

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-text-main mb-3">Category</p>
        <div className="space-y-2">
          <button
            onClick={() => updateParams({ category: '' })}
            className={clsx(
              'block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors',
              category === '' ? 'bg-forest/10 text-forest font-medium' : 'text-text-secondary hover:bg-bg-ivory'
            )}
          >
            All Categories
          </button>
          {categories?.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParams({ category: cat })}
              className={clsx(
                'block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors',
                category === cat ? 'bg-forest/10 text-forest font-medium' : 'text-text-secondary hover:bg-bg-ivory'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-text-main mb-3">Max Price (Rs.)</p>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => updateParams({ maxPrice: e.target.value })}
          placeholder="e.g. 500"
          className="w-full rounded-lg border border-line bg-surface-cream px-3 py-2 text-sm outline-none focus:border-forest"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => updateParams({ inStockOnly: e.target.checked })}
          className="h-4 w-4 rounded border-line accent-forest"
        />
        <span className="text-sm text-text-main">In stock only</span>
      </label>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="text-xs font-medium text-error hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="bg-bg-ivory min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text-main mb-2">
            Fresh Products
          </h1>
          <p className="text-text-secondary text-sm sm:text-base">
            Browse this week's available stock from local farmers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1 flex items-center gap-2 rounded-full border border-line bg-surface-cream px-4 py-2.5">
            <Search size={18} className="text-text-secondary shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateParams({ search: e.target.value })}
              placeholder="Search products or farmers..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-secondary"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="rounded-full border border-line bg-surface-cream px-4 py-2.5 text-sm outline-none focus:border-forest"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <button
            onClick={() => document.getElementById('mobile-filter-drawer')?.classList.remove('hidden')}
            className="lg:hidden flex items-center justify-center gap-2 rounded-full border border-line bg-surface-cream px-4 py-2.5 text-sm font-medium"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          <aside className="hidden lg:block">{FilterPanel}</aside>

          <div id="mobile-filter-drawer" className="hidden lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-charcoal/40"
              onClick={() => document.getElementById('mobile-filter-drawer')?.classList.add('hidden')}
            />
            <div className="relative ml-auto h-full w-72 bg-surface-cream p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <p className="font-semibold text-text-main">Filters</p>
                <button
                  onClick={() => document.getElementById('mobile-filter-drawer')?.classList.add('hidden')}
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>
              {FilterPanel}
            </div>
          </div>

          <div>
            {isError ? (
              <p className="text-sm text-error text-center py-16">Couldn't load products right now.</p>
            ) : isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-text-main font-medium mb-1">No products found</p>
                <p className="text-sm text-text-secondary">Try adjusting your filters or search.</p>
              </div>
            ) : (
              <>
                <div className={clsx(
                  'grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 transition-opacity',
                  isFetching && 'opacity-60'
                )}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => updateParams({ page: page - 1 }, false)}
                      disabled={page <= 1}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-text-main hover:border-forest disabled:opacity-40 disabled:pointer-events-none"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-text-secondary px-2">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => updateParams({ page: page + 1 }, false)}
                      disabled={page >= totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-text-main hover:border-forest disabled:opacity-40 disabled:pointer-events-none"
                      aria-label="Next page"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}