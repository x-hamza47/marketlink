import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useFarmerOrderAnalytics } from '@/features/farmer/useFarmerOverview'
import Surface from '@/components/ui/Surface'
import RangeToggle from '@/components/ui/RangeToggle'

const RANGE_OPTIONS = ['7D', '30D', '3M', '12M']

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-cream border border-line rounded-md px-3 py-2 shadow-sm text-xs">
      <p className="font-medium text-text-main mb-1">{label}</p>
      <p className="text-text-secondary">
        Orders: <span className="text-forest font-medium">{payload[0].value}</span>
      </p>
    </div>
  )
}

export default function FarmerOrderAnalyticsChart() {
  const [range, setRange] = useState('7D')
  const { data, isLoading } = useFarmerOrderAnalytics(range)

  return (
    <Surface className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-lg font-medium text-text-main">Your Order Analytics</h2>
          <p className="text-xs text-text-secondary mt-0.5">Orders placed against your stock over time</p>
        </div>
        <RangeToggle options={RANGE_OPTIONS} value={range} onChange={setRange} />
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-sm text-text-secondary">
          Loading chart…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="farmerOrderFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1F4D3A" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#1F4D3A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#DDE3DC" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B746D' }} axisLine={{ stroke: '#DDE3DC' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6B746D' }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="orders" stroke="#1F4D3A" strokeWidth={2} fill="url(#farmerOrderFill)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Surface>
  )
}