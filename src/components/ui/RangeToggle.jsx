import { cn } from '@/lib/utils'

/**
 * Segmented range toggle. Usage:
 * <RangeToggle options={['7D','30D','3M','12M']} value={range} onChange={setRange} />
 */
export default function RangeToggle({ options, value, onChange, className }) {
  return (
    <div className={cn('inline-flex items-center bg-bg-ivory border border-line rounded-md p-0.5', className)}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded transition-colors',
            value === opt
              ? 'bg-forest text-white'
              : 'text-text-secondary hover:text-text-main'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}