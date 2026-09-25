import { useMemo, useState } from 'react'
import {
    useMarkets,
    useMarketStats,
    useUpdateMarketStatus,
    useDeleteMarket,
} from '@/features/admin/useMarkets'
import Surface from '@/components/ui/Surface'
import Stat from '@/components/ui/Stat'
import StatusBadge from '@/components/ui/StatusBadge'
import ActionMenu from '@/components/ui/ActionMenu'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import MarketMap from '@/components/admin/MarketMap'
import MarketDetailModal from '@/components/admin/MarketDetailModal'
import { cn } from '@/lib/utils'
import { Store, CheckCircle2, Users, Package, Eye, Ban, Trash2, Plus } from 'lucide-react'
import SearchInput from '@/components/ui/SearchInput'
import Button from '@/components/ui/Button'
import AddMarketModal from '@/components/admin/AddMarketModal'

const STAT_CONFIG = [
    { key: 'total', label: 'Total Markets', icon: Store },
    { key: 'active', label: 'Active Markets', icon: CheckCircle2 },
    { key: 'totalFarmers', label: 'Farmers Across Markets', icon: Users },
    { key: 'totalProducts', label: 'Products Listed', icon: Package },
]
const BATCH_SIZE = 4
function StatSkeleton() {
    return (
        <Surface className="p-5 flex flex-col gap-3 animate-pulse">
            <div className="h-4 w-20 bg-line rounded" />
            <div className="h-8 w-14 bg-line rounded" />
        </Surface>
    )
}

export default function MarketsPage() {
    const { data: stats, isLoading: statsLoading } = useMarketStats()
    const { data: markets, isLoading, isError } = useMarkets()
    const updateStatus = useUpdateMarketStatus()
    const deleteMarketMutation = useDeleteMarket()

    const [selectedMarketId, setSelectedMarketId] = useState(null)
    const [viewingMarket, setViewingMarket] = useState(null)
    const [deletingMarket, setDeletingMarket] = useState(null)
    const [search, setSearch] = useState('')
    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
    const [addMarketOpen, setAddMarketOpen] = useState(false)

    const filteredMarkets = useMemo(() => {
        if (!markets) return []
        const q = search.trim().toLowerCase()
        if (!q) return markets
        return markets.filter(
            (m) => m.name.toLowerCase().includes(q) || m.address.toLowerCase().includes(q)
        )
    }, [markets, search])

    const visibleMarkets = filteredMarkets.slice(0, visibleCount)
    const hasMore = visibleCount < filteredMarkets.length

    return (
        <div className="space-y-6">
            {/* Stat strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statsLoading
                    ? STAT_CONFIG.map((item) => <StatSkeleton key={item.key} />)
                    : STAT_CONFIG.map((item) => (
                        <Stat
                            key={item.key}
                            label={item.label}
                            value={(stats?.[item.key] ?? 0).toLocaleString()}
                            icon={item.icon}
                        />
                    ))}
            </div>

            {/* Split layout: compact list (left) + map (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 h-[560px]">
                {/* Left: compact market list */}
                <Surface className="p-4 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h2 className="font-display text-lg font-medium text-text-main">Markets</h2>
                        <Button size="sm" onClick={() => setAddMarketOpen(true)}>
                            <Plus className="w-4 h-4" strokeWidth={2} />
                            Add
                        </Button>
                    </div>

                    <SearchInput
                        value={search}
                        onChange={(v) => {
                            setSearch(v)
                            setVisibleCount(BATCH_SIZE)
                        }}
                        placeholder="Search markets…"
                        className="mb-3"
                    />

                    {isError ? (
                        <p className="text-sm text-error py-6 text-center">Couldn't load markets.</p>
                    ) : isLoading ? (
                        <div className="py-10 text-center text-sm text-text-secondary">Loading markets…</div>
                    ) : filteredMarkets.length === 0 ? (
                        <div className="py-10 text-center text-sm text-text-secondary">No markets yet.</div>
                    ) : (
                        <div className="space-y-1.5">
                            {visibleMarkets.map((market) => (
                                <div
                                    key={market.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setSelectedMarketId(market.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            setSelectedMarketId(market.id)
                                        }
                                    }}
                                    className={cn(
                                        'w-full text-left px-3 py-2.5 rounded-md border transition-colors cursor-pointer',
                                        selectedMarketId === market.id
                                            ? 'border-forest bg-forest/5'
                                            : 'border-transparent hover:bg-bg-ivory'
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-text-main truncate">{market.name}</p>
                                            <p className="text-xs text-text-secondary truncate mt-0.5">{market.address}</p>
                                            <p className="text-xs text-text-secondary mt-1">
                                                {market.operatingDays.join(', ')} &middot; {market.farmers} farmers
                                            </p>
                                        </div>
                                        <StatusBadge status={market.status} className="shrink-0" />
                                    </div>

                                    <div className="flex items-center justify-end gap-1 mt-2">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setViewingMarket(market)
                                            }}
                                            className="p-1.5 rounded-md hover:bg-bg-ivory text-text-secondary"
                                            aria-label="View market"
                                        >
                                            <Eye className="w-4 h-4" strokeWidth={1.75} />
                                        </button>
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <ActionMenu
                                                actions={[
                                                    market.status === 'active'
                                                        ? {
                                                            label: 'Deactivate',
                                                            icon: Ban,
                                                            danger: true,
                                                            onClick: () =>
                                                                updateStatus.mutate({ marketId: market.id, status: 'inactive' }),
                                                        }
                                                        : {
                                                            label: 'Activate',
                                                            icon: CheckCircle2,
                                                            onClick: () =>
                                                                updateStatus.mutate({ marketId: market.id, status: 'active' }),
                                                        },
                                                    {
                                                        label: 'Remove',
                                                        icon: Trash2,
                                                        danger: true,
                                                        onClick: () => setDeletingMarket(market),
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {hasMore && (
                                <button
                                    type="button"
                                    onClick={() => setVisibleCount((c) => c + BATCH_SIZE)}
                                    className="w-full text-center text-sm font-medium text-forest py-2.5 rounded-md hover:bg-forest/5 transition-colors"
                                >
                                    Load more ({filteredMarkets.length - visibleCount} remaining)
                                </button>
                            )}
                        </div>

                    )}
                </Surface>

                {/* Right: map */}
                <div className="h-full">
                    {!isLoading && markets && (
                        <MarketMap
                            markets={filteredMarkets}
                            selectedMarketId={selectedMarketId}
                            onSelectMarket={setSelectedMarketId}
                        />
                    )}
                </div>
            </div>

            <MarketDetailModal
                market={viewingMarket}
                open={!!viewingMarket}
                onClose={() => setViewingMarket(null)}
            />

            <ConfirmDialog
                open={!!deletingMarket}
                onClose={() => setDeletingMarket(null)}
                onConfirm={() => {
                    deleteMarketMutation.mutate(deletingMarket.id)
                    setDeletingMarket(null)
                }}
                title="Remove Market"
                description={`Remove "${deletingMarket?.name}"? This cannot be undone.`}
                confirmLabel="Remove"
            />
            <AddMarketModal open={addMarketOpen} onClose={() => setAddMarketOpen(false)} />
        </div>
    )
}