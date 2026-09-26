import { useFarmerOverviewStats, useFarmerRecentOrders } from '@/features/farmer/useFarmerOverview'
import Surface from '@/components/ui/Surface'
import Stat from '@/components/ui/Stat'
import Table from '@/components/ui/Table'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/format'
import { ClipboardList, Clock, Wallet } from 'lucide-react'
import FarmerOrderAnalyticsChart from './FarmerOrderAnalyticsChart'

const STAT_CONFIG = [
    { key: 'totalOrders', label: 'Total Orders', icon: ClipboardList },
    { key: 'pendingOrders', label: 'Pending Orders', icon: Clock },
    { key: 'revenue', label: 'Revenue Summary', icon: Wallet, isCurrency: true },
]

function StatSkeleton() {
    return (
        <Surface className="p-5 flex flex-col gap-3 animate-pulse">
            <div className="h-4 w-20 bg-line rounded" />
            <div className="h-8 w-14 bg-line rounded" />
        </Surface>
    )
}

export default function FarmerOverview() {
    const { data: stats, isLoading: statsLoading } = useFarmerOverviewStats()
    const { data: recentOrders, isLoading: ordersLoading } = useFarmerRecentOrders()

    return (
        <div className="space-y-6">
            {/* Stat strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statsLoading
                    ? STAT_CONFIG.map((item) => <StatSkeleton key={item.key} />)
                    : STAT_CONFIG.map((item) => (
                        <Stat
                            key={item.key}
                            label={item.label}
                            value={
                                item.isCurrency
                                    ? `Rs. ${(stats?.[item.key] ?? 0).toLocaleString()}`
                                    : (stats?.[item.key] ?? 0).toLocaleString()
                            }
                            icon={item.icon}
                        />
                    ))}
            </div>
            <FarmerOrderAnalyticsChart />
            {/* Recent pre-orders */}
            <Surface className="p-5">
                <div className="mb-4">
                    <h2 className="font-display text-lg font-medium text-text-main">Recent Pre-Orders</h2>
                    <p className="text-xs text-text-secondary mt-0.5">Latest orders placed against your stock</p>
                </div>

                {ordersLoading ? (
                    <div className="py-10 text-center text-sm text-text-secondary">Loading orders…</div>
                ) : !recentOrders?.length ? (
                    <div className="py-10 text-center text-sm text-text-secondary">No orders yet.</div>
                ) : (
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeadCell>Order</Table.HeadCell>
                                <Table.HeadCell>Customer</Table.HeadCell>
                                <Table.HeadCell>Market</Table.HeadCell>
                                <Table.HeadCell>Items</Table.HeadCell>
                                <Table.HeadCell>Total</Table.HeadCell>
                                <Table.HeadCell>Pickup</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {recentOrders.map((order) => (
                                <Table.Row key={order.id}>
                                    <Table.Cell className="font-medium text-text-main">{order.id}</Table.Cell>
                                    <Table.Cell className="text-text-secondary">{order.customer}</Table.Cell>
                                    <Table.Cell className="text-text-secondary">{order.market}</Table.Cell>
                                    <Table.Cell>{order.items}</Table.Cell>
                                    <Table.Cell>Rs. {order.total.toLocaleString()}</Table.Cell>
                                    <Table.Cell className="text-text-secondary">{formatDate(order.pickupDate)}</Table.Cell>
                                    <Table.Cell>
                                        <StatusBadge status={order.status} />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </Surface>
        </div>
    )
}