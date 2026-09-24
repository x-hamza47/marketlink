import { cn } from '@/lib/utils'

const SIZES = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
}

function getInitials(name = '') {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}


export default function Avatar({ src, name = '', size = 'md', className }) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-medium shrink-0 overflow-hidden',
        'bg-forest/10 text-forest',
        SIZES[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  )
}