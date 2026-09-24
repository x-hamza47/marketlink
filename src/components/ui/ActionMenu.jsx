import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Dropdown action menu for table rows.
 *
 * Usage:
 * <ActionMenu
 *   actions={[
 *     { label: 'View', icon: Eye, onClick: () => {...} },
 *     { label: 'Edit', icon: Pencil, onClick: () => {...} },
 *     { label: 'Delete', icon: Trash2, onClick: () => {...}, danger: true },
 *   ]}
 * />
 */
export default function ActionMenu({ actions = [] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-md hover:bg-bg-ivory text-text-secondary"
        aria-label="More actions"
        aria-expanded={open}
      >
        <MoreHorizontal className="w-4 h-4" strokeWidth={1.75} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-44 bg-surface-cream border border-line rounded-md shadow-lg py-1 z-40"
          role="menu"
        >
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  action.onClick?.()
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors',
                  action.danger
                    ? 'text-error hover:bg-error/5'
                    : 'text-text-main hover:bg-bg-ivory'
                )}
              >
                {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />}
                {action.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}