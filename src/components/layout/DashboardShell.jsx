import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardShell({
  navSections,
  pageTitle = '',
  badgeLabel = '',
  badgeClassName = 'text-amber-dark bg-amber/15',
  searchPlaceholder = 'Search…',
  children,
}) {
  return (
    <div className="min-h-screen flex bg-bg-ivory">
      <Sidebar navSections={navSections} badgeLabel={badgeLabel} badgeClassName={badgeClassName} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar pageTitle={pageTitle} searchPlaceholder={searchPlaceholder} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}