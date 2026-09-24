import { cn } from '@/lib/utils'

function Table({ className, children, ...props }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-line">
      <table className={cn('w-full text-sm border-collapse', className)} {...props}>
        {children}
      </table>
    </div>
  )
}

function Header({ className, children, ...props }) {
  return (
    <thead className={cn('bg-bg-ivory border-b border-line', className)} {...props}>
      {children}
    </thead>
  )
}

function Body({ className, children, ...props }) {
  return (
    <tbody className={cn('divide-y divide-line', className)} {...props}>
      {children}
    </tbody>
  )
}

function Row({ className, children, ...props }) {
  return (
    <tr className={cn('hover:bg-bg-ivory/60 transition-colors', className)} {...props}>
      {children}
    </tr>
  )
}

function HeadCell({ className, children, ...props }) {
  return (
    <th
      className={cn(
        'text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide whitespace-nowrap',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

function Cell({ className, children, ...props }) {
  return (
    <td className={cn('px-4 py-3 text-text-main align-middle', className)} {...props}>
      {children}
    </td>
  )
}

Table.Header = Header
Table.Body = Body
Table.Row = Row
Table.HeadCell = HeadCell
Table.Cell = Cell

export default Table