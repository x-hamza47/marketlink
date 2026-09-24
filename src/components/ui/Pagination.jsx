import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Usage: <Pagination page={page} totalPages={total} onPageChange={setPage} />
 */
export default function Pagination({ page, totalPages, onPageChange, className }) {
  if (totalPages <= 1) return null

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <span className="text-xs text-text-secondary">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="p-1.5 rounded-md border border-line disabled:opacity-40 hover:bg-bg-ivory"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="p-1.5 rounded-md border border-line disabled:opacity-40 hover:bg-bg-ivory"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}