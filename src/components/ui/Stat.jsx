import { cn } from '@/lib/utils'
import Surface from './Surface'
import { TrendingUp, TrendingDown } from 'lucide-react'


export default function Stat({ label, value, trend, icon: Icon, className }) {
  const hasTrend = typeof trend === 'number'
  const isPositive = trend > 0

  return (
    <Surface className={cn('p-5 flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary font-medium">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-text-secondary" strokeWidth={1.75} />}
      </div>

      <div className="flex items-end justify-between">
        <span className="font-display text-4xl font-medium text-text-main tabular-nums">
          {value}
        </span>

        {hasTrend && (
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-medium mb-1',
              isPositive ? 'text-success' : 'text-error'
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" strokeWidth={2} />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </Surface>
  )
}