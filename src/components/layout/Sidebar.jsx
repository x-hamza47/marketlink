import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/stores/uiStore'
import { X, LogOut } from 'lucide-react'

function SidebarNavLink({ label, icon: Icon, path, isCollapsed, onNavigate }) {
  return (
    <NavLink
      to={path}
      end={path === '/admin' || path === '/farmer' || path === '/customer'}
      onClick={onNavigate}
      title={isCollapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors relative',
          isCollapsed && 'justify-center',
          isActive
            ? 'bg-forest/10 text-forest'
            : 'text-text-secondary hover:bg-bg-ivory hover:text-text-main'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-forest rounded-full" />
          )}
          <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          {!isCollapsed && <span className="truncate">{label}</span>}
        </>
      )}
    </NavLink>
  )
}

function SidebarBody({ navSections, badgeLabel, badgeClassName, isCollapsed, onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={cn('h-16 flex items-center border-b border-line/60', isCollapsed ? 'justify-center px-2' : 'px-5')}>
        {isCollapsed ? (
          <span className="font-display text-xl font-semibold text-forest">M</span>
        ) : (
          <>
            <span className="font-display text-xl font-semibold text-forest">MarketLink</span>
            <span className={cn('ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded', badgeClassName)}>
              {badgeLabel}
            </span>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            {!isCollapsed && (
              <p className="px-2 mb-1.5 text-[11px] font-semibold text-text-secondary/70 uppercase tracking-wide">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarNavLink
                  key={item.path}
                  label={item.label}
                  icon={item.icon}
                  path={item.path}
                  isCollapsed={isCollapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer: logout */}
      <div className="px-3 py-4 border-t border-line/60">
        <button
          type="button"
          title={isCollapsed ? 'Logout' : undefined}
          className={cn(
            'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium text-error/80 hover:bg-error/5 hover:text-error transition-colors',
            isCollapsed && 'justify-center'
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          {!isCollapsed && 'Logout'}
        </button>
      </div>
    </div>
  )
}


export default function Sidebar({ navSections, badgeLabel, badgeClassName }) {
  const isCollapsed = useUiStore((state) => state.isSidebarCollapsed)
  const isMobileNavOpen = useUiStore((state) => state.isMobileNavOpen)
  const closeMobileNav = useUiStore((state) => state.closeMobileNav)

  return (
    <>
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 250 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden lg:block shrink-0 border-r border-line/60 bg-surface-cream sticky top-0 h-screen overflow-hidden"
      >
        <SidebarBody
          navSections={navSections}
          badgeLabel={badgeLabel}
          badgeClassName={badgeClassName}
          isCollapsed={isCollapsed}
        />
      </motion.aside>

      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={closeMobileNav}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="absolute left-0 top-0 h-full w-70 bg-surface-cream shadow-xl"
            >
              <button
                type="button"
                onClick={closeMobileNav}
                className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-bg-ivory"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarBody
                navSections={navSections}
                badgeLabel={badgeLabel}
                badgeClassName={badgeClassName}
                isCollapsed={false}
                onNavigate={closeMobileNav}
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}