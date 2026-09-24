import { useOverviewStats } from '@/features/admin/useOverviewStats'
import Stat from '@/components/ui/Stat'
import Surface from '@/components/ui/Surface'
import {
  Users,
  UserCircle,
  Store,
  ClipboardList,
  UserCheck,
  Package,
  PackageCheck,
  Star,
} from 'lucide-react'

// Config-driven so the JSX below stays a clean .map(), not 8 copy-pasted <Stat> blocks.
const KPI_CONFIG = [
  { key: 'totalFarmers', label: 'Farmers', icon: Users },
  { key: 'totalCustomers', label: 'Customers', icon: UserCircle },
  { key: 'totalMarkets', label: 'Markets', icon: Store },
  { key: 'totalOrders', label: 'Orders', icon: ClipboardList },
  { key: 'pendingFarmerApprovals', label: 'Pending Approvals', icon: UserCheck },
  { key: 'activeProducts', label: 'Active Products', icon: Package },
  { key: 'readyForPickup', label: 'Ready for Pickup', icon: PackageCheck },
  { key: 'reviewsAwaitingModeration', label: 'Reviews to Moderate', icon: Star },
]

function StatSkeleton() {
  return (
    <Surface className="p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-4 w-20 bg-line rounded" />
      <div className="h-8 w-14 bg-line rounded" />
    </Surface>
  )
}

export default function OverviewKpiStrip() {
  const { data: stats, isLoading, isError } = useOverviewStats()

  if (isError) {
    return (
      <Surface className="p-5 text-sm text-error">
        Couldn't load dashboard stats. Please try again.
      </Surface>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {isLoading
        ? KPI_CONFIG.map((item) => <StatSkeleton key={item.key} />)
        : KPI_CONFIG.map((item) => (
            <Stat
              key={item.key}
              label={item.label}
              value={stats[item.key].toLocaleString()}
              trend={stats.trends?.[item.key]}
              icon={item.icon}
            />
          ))}
    </div>
  )
}