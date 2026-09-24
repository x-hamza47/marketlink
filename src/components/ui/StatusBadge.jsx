import { cn } from '@/lib/utils'

const STATUS_STYLES = {

  placed: 'bg-line text-text-secondary',
  accepted: 'bg-amber/15 text-amber-dark border border-amber/30',
  ready_for_pickup: 'bg-forest/10 text-forest border border-forest/20',
  completed: 'bg-success/10 text-success border border-success/20',
  cancelled: 'bg-error/10 text-error border border-error/20',
  declined: 'bg-error/10 text-error border border-error/20',

  pending: 'bg-warning/10 text-warning border border-warning/20',
  approved: 'bg-success/10 text-success border border-success/20',
  suspended: 'bg-error/10 text-error border border-error/20',
  rejected: 'bg-error/10 text-error border border-error/20',

  available: 'bg-success/10 text-success border border-success/20',
  unavailable: 'bg-error/10 text-error border border-error/20',
  low_stock: 'bg-warning/10 text-warning border border-warning/20',
}


const STATUS_LABELS = {
  placed: 'Placed',
  accepted: 'Accepted',
  ready_for_pickup: 'Ready for Pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
  declined: 'Declined',
  pending: 'Pending',
  approved: 'Approved',
  suspended: 'Suspended',
  rejected: 'Rejected',
  available: 'Available',
  unavailable: 'Unavailable',
  low_stock: 'Low Stock',
}


export default function StatusBadge({ status, className }) {
  const style = STATUS_STYLES[status] ?? 'bg-line text-text-secondary'
  const label = STATUS_LABELS[status] ?? status

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        style,
        className
      )}
    >
      {label}
    </span>
  )
}