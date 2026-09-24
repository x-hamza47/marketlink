import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SearchInput({ value, onChange, placeholder = 'Search…', className }) {
  return (
    <div className={cn('flex items-center gap-2 px-3 h-9 rounded-md border border-line bg-surface-cream', className)}>
      <Search className="w-4 h-4 text-text-secondary shrink-0" strokeWidth={1.75} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none text-sm w-full placeholder:text-text-secondary/70"
      />
    </div>
  )
}