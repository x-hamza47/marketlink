import { useState } from 'react'
import { cn } from '../lib/utils'
import Avatar from '../components/ui/Avatar'
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Store,
  Package,
  ClipboardList,
  Star,
  FileBarChart,
  LineChart,
  Tags,
  Megaphone,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ label: 'Overview', icon: LayoutDashboard }],
  },
  {
    label: 'Management',
    items: [
      { label: 'Farmers', icon: Users },
      { label: 'Customers', icon: UserCircle },
      { label: 'Markets', icon: Store },
      { label: 'Products', icon: Package },
      { label: 'Orders', icon: ClipboardList },
      { label: 'Reviews', icon: Star },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Reports', icon: FileBarChart },
      { label: 'Analytics', icon: LineChart },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Categories', icon: Tags },
      { label: 'Announcements', icon: Megaphone },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', icon: Settings },
      { label: 'Help', icon: HelpCircle },
    ],
  },
]

function NavLink({ label, icon: Icon, isActive }) {
  return (
    <button
      type="button"
      className={cn(
        'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors relative text-left',
        isActive
          ? 'bg-forest/10 text-forest'
          : 'text-text-secondary hover:bg-bg-ivory hover:text-text-main'
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-forest rounded-full" />
      )}
      <Icon className="w-4 h-4" strokeWidth={1.75} />
      {label}
    </button>
  )
}

function SidebarContent({ activeItem }) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-line/60">
        <span className="font-display text-xl font-semibold text-forest">
          MarketLink
        </span>
        <span className="ml-2 text-[10px] font-medium text-amber-dark bg-amber/15 px-1.5 py-0.5 rounded">
          ADMIN
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-2 mb-1.5 text-[11px] font-semibold text-text-secondary/70 uppercase tracking-wide">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  isActive={item.label === activeItem}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer: profile + logout */}
      <div className="px-3 py-4 border-t border-line/60 space-y-0.5">
        <button
          type="button"
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-bg-ivory hover:text-text-main transition-colors text-left"
        >
          <UserCircle className="w-4 h-4" strokeWidth={1.75} />
          Profile
        </button>
        <button
          type="button"
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium text-error/80 hover:bg-error/5 hover:text-error transition-colors text-left"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.75} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ activeItem = 'Overview', pageTitle = 'Overview', children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const user = useAuthStore((state) => state.user)

  return (
    <div className="min-h-screen flex bg-bg-ivory">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-62.5 shrink-0 border-r border-line/60 bg-surface-cream sticky top-0 h-screen">
        <SidebarContent activeItem={activeItem} />
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-70 bg-surface-cream shadow-xl">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-bg-ivory"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent activeItem={activeItem} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Utility topbar */}
        <header className="h-16 shrink-0 border-b border-line/60 bg-surface-cream flex items-center gap-4 px-4 lg:px-6 sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden p-1.5 rounded-md hover:bg-bg-ivory"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="font-display text-lg font-medium text-text-main shrink-0">
            {pageTitle}
          </h1>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm ml-4 px-3 h-9 rounded-md border border-line bg-bg-ivory text-text-secondary">
            <Search className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Search orders, farmers, products…"
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
            <Avatar name={user?.name} src={user?.avatarUrl}  size="sm" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}