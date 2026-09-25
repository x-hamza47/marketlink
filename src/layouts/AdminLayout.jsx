import { Outlet, useLocation } from 'react-router-dom'
import DashboardShell from '@/components/layout/DashboardShell'
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
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ label: 'Overview', icon: LayoutDashboard, path: '/admin' }],
  },
  {
    label: 'Management',
    items: [
      { label: 'Farmers', icon: Users, path: '/admin/farmers' },
      { label: 'Customers', icon: UserCircle, path: '/admin/customers' },
      { label: 'Markets', icon: Store, path: '/admin/markets' },
      { label: 'Products', icon: Package, path: '/admin/products' },
      { label: 'Orders', icon: ClipboardList, path: '/admin/orders' },
      { label: 'Reviews', icon: Star, path: '/admin/reviews' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Reports & Analytics', icon: FileBarChart, path: '/admin/reports' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Categories', icon: Tags, path: '/admin/categories' },
      { label: 'Announcements', icon: Megaphone, path: '/admin/announcements' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', icon: Settings, path: '/admin/settings' },
      { label: 'Help', icon: HelpCircle, path: '/admin/help' },
    ],
  },
]


const ALL_ITEMS = NAV_SECTIONS.flatMap((section) => section.items)


function usePageTitleFromPath() {
  const location = useLocation()
  const match = ALL_ITEMS.find((item) => item.path === location.pathname)
  return match?.label ?? 'Admin'
}

export default function AdminLayout() {
  const pageTitle = usePageTitleFromPath()

  return (
    <DashboardShell
      navSections={NAV_SECTIONS}
      pageTitle={pageTitle}
      badgeLabel="ADMIN"
      badgeClassName="text-amber-dark bg-amber/15"
      searchPlaceholder="Search orders, farmers, products…"
    >
      <Outlet />
    </DashboardShell>
  )
}