// src/components/public/Navbar.jsx
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Sprout, Menu, X, ShoppingCart } from 'lucide-react'
import clsx from 'clsx'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'
import AccountMenu from '../ui/AccountMenu'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Explore Markets', path: '/markets' },
  { label: 'Products', path: '/products' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'About', path: '/about' },
]

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface-cream/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-white">
            <Sprout size={18} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-semibold text-text-main">
              MarketLink
            </span>
            <span className="text-[11px] text-text-secondary -mt-1">
              eGreen Basket
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                clsx(
                  'text-sm font-medium transition-colors relative pb-1',
                  isActive
                    ? 'text-forest after:absolute after:left-0 after:-bottom-px after:h-0.5 after:w-full after:bg-forest'
                    : 'text-text-secondary hover:text-forest'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line hover:border-forest transition-colors">
            <ShoppingCart size={17} className="text-text-main" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-forest text-[9px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <AccountMenu />
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-line px-5 py-2 text-sm font-medium text-text-main hover:border-forest hover:text-forest transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-forest px-5 py-2 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full border border-line text-text-main"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="lg:hidden border-t border-line bg-surface-cream px-6 py-4">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-forest/10 text-forest'
                      : 'text-text-secondary hover:bg-forest/5 hover:text-forest'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
            {isAuthenticated ? (
              <div className="flex justify-center py-2">
                <AccountMenu />
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-full border border-line px-5 py-2.5 text-center text-sm font-medium text-text-main"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-full bg-forest px-5 py-2.5 text-center text-sm font-medium text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}