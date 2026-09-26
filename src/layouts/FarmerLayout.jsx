import { Outlet, useLocation } from 'react-router-dom'
import DashboardShell from '@/components/layout/DashboardShell'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Star,
  Store,
  Settings,
  HelpCircle,
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ label: 'Overview', icon: LayoutDashboard, path: '/farmer' }],
  },
  {
    label: 'Management',
    items: [
      { label: 'My Products', icon: Package, path: '/farmer/products' },
      { label: 'Orders', icon: ClipboardList, path: '/farmer/orders' },
      { label: 'Reviews', icon: Star, path: '/farmer/reviews' },
    ],
  },
  {
    label: 'Stall',
    items: [
      { label: 'My Stall Profile', icon: Store, path: '/farmer/stall' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', icon: Settings, path: '/farmer/settings' },
      { label: 'Help', icon: HelpCircle, path: '/farmer/help' },
    ],
  },
]

const ALL_ITEMS = NAV_SECTIONS.flatMap((section) => section.items)

function usePageTitleFromPath() {
  const location = useLocation()
  const match = ALL_ITEMS.find((item) => item.path === location.pathname)
  return match?.label ?? 'Farmer'
}

export default function FarmerLayout() {
  const pageTitle = usePageTitleFromPath()

  return (
    <DashboardShell
      navSections={NAV_SECTIONS}
      pageTitle={pageTitle}
      badgeLabel="FARMER"
      badgeClassName="text-forest bg-forest/10"
      searchPlaceholder="Search your products, orders…"
    >
      <Outlet />
    </DashboardShell>
  )
}