import { cn } from '@/lib/utils'

export default function Surface({ as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'bg-surface-cream border border-line rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}