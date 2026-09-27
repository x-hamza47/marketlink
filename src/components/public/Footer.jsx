// src/components/public/Footer.jsx
import { Link } from 'react-router-dom'
import { Sprout, Send } from 'lucide-react'

const FOOTER_COLUMNS = [
  { title: 'Explore', links: [{ label: 'Markets', to: '/markets' }, { label: 'Products', to: '/products' }, { label: 'How It Works', to: '/how-it-works' }, { label: 'About Us', to: '/about' }, { label: 'Contact', to: '/contact' }] },
  { title: 'Account', links: [{ label: 'Log In', to: '/login' }, { label: 'Create Account', to: '/signup' }, { label: 'Order History', to: '/account/orders' }, { label: 'Favorites', to: '/account/favorites' }] },
  { title: 'For Farmers', links: [{ label: 'Join as Farmer', to: '/farmer/register' }, { label: 'Manage Products', to: '/farmer/products' }, { label: 'Orders', to: '/farmer/orders' }, { label: 'Dashboard', to: '/farmer' }] },
  { title: 'Legal', links: [{ label: 'Privacy Policy', to: '/privacy' }, { label: 'Terms & Conditions', to: '/terms' }, { label: 'Refund Policy', to: '/refund' }] },
]

// Simple inline brand icons — lucide-react dropped these (trademarked logos
// aren't part of its generic UI icon set), so we keep small local SVGs instead.
const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: '#',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.6 1.5-4 3.9-4 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: '#',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1c.5 1.6 2.1 2.8 3.9 2.9A8.2 8.2 0 0 1 2 18.6a11.6 11.6 0 0 0 6.3 1.9c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-charcoal text-warm-cream">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-white">
                <Sprout size={18} />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-display text-lg font-semibold text-white">MarketLink</span>
                <span className="text-[11px] text-muted-stone -mt-1">eGreen Basket</span>
              </div>
            </div>
            <p className="text-sm text-muted-stone mb-5 max-w-xs">
              Connecting local farmers and communities. Fresh, local and trusted.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 max-w-xs">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full bg-dark-surface border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-muted-stone outline-none focus:border-forest-light"
              />
              <button
                type="submit"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-white hover:bg-forest-light transition-colors"
                aria-label="Subscribe"
              >
                <Send size={15} />
              </button>
            </form>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold text-white mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="text-sm text-muted-stone hover:text-warm-cream transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <p className="text-xs text-muted-stone">© 2026 MarketLink. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, svg }) => (
              <a
                key={label}
                href={href}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-dark-surface text-muted-stone hover:text-white transition-colors"
                aria-label={label}
              >
                {svg}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}