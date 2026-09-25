import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useReportsSummary, useRevenueByMarket, useTopFarmers } from '@/features/admin/useReports'
import Surface from '@/components/ui/Surface'
import Stat from '@/components/ui/Stat'
import { formatCurrency } from '@/lib/format'
import { ClipboardList, Wallet, Store, Trophy } from 'lucide-react'

const STAT_CONFIG = [
  { key: 'totalOrders', label: 'Total Orders', icon: ClipboardList, format: (v) => v.toLocaleString() },
  { key: 'totalRevenue', label: 'Total Revenue', icon: Wallet, format: formatCurrency },
  { key: 'activeMarkets', label: 'Active Markets', icon: Store, format: (v) => v.toLocaleString() },
]

function StatSkeleton() {
  return (
    <Surface className="p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-4 w-20 bg-line rounded" />
      <div className="h-8 w-14 bg-line rounded" />
    </Surface>
  )
}

function RowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 animate-pulse">
      <div className="h-4 w-32 bg-line rounded" />
      <div className="h-4 w-16 bg-line rounded" />
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-cream border border-line rounded-md px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-text-main mb-1">{label}</p>
      <p className="text-text-secondary">
        Revenue: <span className="text-text-main font-medium">{formatCurrency(payload[0].value)}</span>
      </p>
    </div>
  )
}

export default function ReportsPage() {
  const { data: summary, isLoading: summaryLoading } = useReportsSummary()
  const { data: revenueByMarket, isLoading: revenueLoading, isError: revenueError } = useRevenueByMarket()
  const { data: topFarmers, isLoading: farmersLoading, isError: farmersError } = useTopFarmers(5)

  return (
    <div className="space-y-6">
      {/* Stat strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryLoading
          ? STAT_CONFIG.map((item) => <StatSkeleton key={item.key} />)
          : STAT_CONFIG.map((item) => (
              <Stat
                key={item.key}
                label={item.label}
                value={item.format(summary?.[item.key] ?? 0)}
                trend={summary?.trends?.[item.key]}
                icon={item.icon}
              />
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by market */}
        <Surface className="p-5">
          <h2 className="font-display text-lg font-medium text-text-main mb-1">
            Revenue by Market
          </h2>
          <p className="text-xs text-text-secondary mb-4">Completed order revenue, by market</p>

          {revenueError ? (
            <p className="text-sm text-error py-6 text-center">Couldn't load revenue data.</p>
          ) : revenueLoading ? (
            <div className="h-64 flex items-center justify-center text-sm text-text-secondary">
              Loading chart…
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByMarket} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
                  <XAxis
                    dataKey="marketName"
                    tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--color-line)' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-bg-ivory)' }} />
                  <Bar dataKey="revenue" fill="var(--color-forest)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Surface>

        {/* Most active farmers */}
        <Surface className="p-5">
          <h2 className="font-display text-lg font-medium text-text-main mb-1">
            Most Active Farmers
          </h2>
          <p className="text-xs text-text-secondary mb-2">Ranked by completed order volume</p>

          {farmersError ? (
            <p className="text-sm text-error py-6 text-center">Couldn't load farmer data.</p>
          ) : farmersLoading ? (
            <div className="divide-y divide-line/60">
              {Array.from({ length: 5 }).map((_, i) => (
                <RowSkeleton key={i} />
              ))}
            </div>
          ) : !topFarmers?.length ? (
            <div className="py-10 text-center text-sm text-text-secondary">No order data yet.</div>
          ) : (
            <div className="divide-y divide-line/60">
              {topFarmers.map((farmer, index) => (
                <div key={farmer.farmerId} className="flex items-center gap-3 py-3">
                  <div
                    className={
                      index === 0
                        ? 'w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-amber/15 text-amber-dark'
                        : 'w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-bg-ivory text-text-secondary'
                    }
                  >
                    {index === 0 ? (
                      <Trophy className="w-3.5 h-3.5" strokeWidth={1.75} />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-main truncate">{farmer.name}</p>
                    <p className="text-xs text-text-secondary truncate">{farmer.stall}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-text-main">{farmer.orders} orders</p>
                    <p className="text-xs text-text-secondary">{formatCurrency(farmer.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Surface>
      </div>
    </div>
  )
}