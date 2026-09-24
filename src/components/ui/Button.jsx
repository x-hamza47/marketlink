import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const VARIANTS = {
  primary: 'bg-forest text-white hover:bg-forest-dark',
  secondary: 'bg-transparent text-forest border border-line hover:bg-surface-cream',
  amber: 'bg-amber text-charcoal hover:brightness-95',
  ghost: 'bg-transparent text-text-main hover:bg-black/5',
  danger: 'bg-error text-white hover:brightness-95',
}

const SIZES = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

const Button = forwardRef(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button