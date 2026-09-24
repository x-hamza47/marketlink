import { Search, Bell, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'

export default function Topbar({ pageTitle, searchPlaceholder = 'Search…' }) {
  const user = useAuthStore((state) => state.user)
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed)
  const toggleSidebarCollapsed = useUiStore((state) => state.toggleSidebarCollapsed)
  const openMobileNav = useUiStore((state) => state.openMobileNav)

  return (
    <header className="h-16 shrink-0 border-b border-line/60 bg-surface-cream flex items-center gap-4 px-4 lg:px-6 sticky top-0 z-30">
      {/* Mobile: opens drawer */}
      <button
        type="button"
        onClick={openMobileNav}
        className="lg:hidden p-1.5 rounded-md hover:bg-bg-ivory"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop: collapse/expand toggle */}
      <button
        type="button"
        onClick={toggleSidebarCollapsed}
        className="hidden lg:flex p-1.5 rounded-md hover:bg-bg-ivory text-text-secondary"
        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isSidebarCollapsed ? (
          <PanelLeftOpen className="w-4.5 h-4.5" strokeWidth={1.75} />
        ) : (
          <PanelLeftClose className="w-4.5 h-4.5" strokeWidth={1.75} />
        )}
      </button>

      <h1 className="font-display text-lg font-medium text-text-main shrink-0">{pageTitle}</h1>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm ml-4 px-3 h-9 rounded-md border border-line bg-bg-ivory text-text-secondary">
        <Search className="w-4 h-4 shrink-0" strokeWidth={1.75} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="bg-transparent outline-none text-sm w-full placeholder:text-text-secondary/70"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button
          type="button"
          className="relative p-2 rounded-md hover:bg-bg-ivory text-text-secondary"
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5" strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-error" />
        </button>
        <Avatar name={user?.name} src={user?.avatarUrl} size="sm" />
      </div>
    </header>
  )
}