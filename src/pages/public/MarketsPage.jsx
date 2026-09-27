import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Users, Navigation, SlidersHorizontal, X, Map as MapIcon, List } from 'lucide-react'
import { useNearbyMarkets } from '@/features/public/useMarkets'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useDebounce } from '@/hooks/useDebounce'
import MarketMap from '@/components/shared/MarketMap'
import { cn } from '@/lib/utils'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DISTANCE_OPTIONS = [
    { label: 'Any distance', value: '' },
    { label: 'Within 5 km', value: '5' },
    { label: 'Within 10 km', value: '10' },
    { label: 'Within 25 km', value: '25' },
]

function MarketCardSkeleton() {
    return (
        <div className="rounded-2xl border border-line bg-surface-cream p-4 animate-pulse">
            <div className="h-4 w-2/3 bg-line rounded mb-2" />
            <div className="h-3 w-1/2 bg-line rounded mb-3" />
            <div className="h-3 w-full bg-line rounded" />
        </div>
    )
}

export default function MarketsPage() {
    const { location, status: geoStatus, requestLocation } = useGeolocation()
    const [search, setSearch] = useState('')
    const [day, setDay] = useState('')
    const [maxDistanceKm, setMaxDistanceKm] = useState('')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [mobileView, setMobileView] = useState('list')
    const [selectedMarketId, setSelectedMarketId] = useState(null)

    const debouncedSearch = useDebounce(search, 400)

    const { data: markets, isLoading, isError } = useNearbyMarkets({
        search: debouncedSearch,
        day,
        maxDistanceKm,
        lat: location?.[0],
        lng: location?.[1],
    })

    const activeFilterCount = [day, maxDistanceKm].filter(Boolean).length
    const clearFilters = () => {
        setDay('')
        setMaxDistanceKm('')
    }

    const FilterPanel = (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold text-text-main mb-3">Distance</p>
                <div className="space-y-2">
                    {DISTANCE_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setMaxDistanceKm(opt.value)}
                            className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${maxDistanceKm === opt.value ? 'bg-forest/10 text-forest font-medium' : 'text-text-secondary hover:bg-bg-ivory'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                {!location && (
                    <button
                        onClick={requestLocation}
                        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-forest hover:underline"
                    >
                        <Navigation size={12} />
                        {geoStatus === 'loading' ? 'Locating…' : 'Use my location'}
                    </button>
                )}
            </div>

            <div>
                <p className="text-sm font-semibold text-text-main mb-3">Market Day</p>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setDay('')}
                        className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${day === '' ? 'bg-forest text-white border-forest' : 'border-line text-text-secondary hover:border-forest'
                            }`}
                    >
                        Any Day
                    </button>
                    {DAYS.map((d) => (
                        <button
                            key={d}
                            onClick={() => setDay(d)}
                            className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${day === d ? 'bg-forest text-white border-forest' : 'border-line text-text-secondary hover:border-forest'
                                }`}
                        >
                            {d.slice(0, 3)}
                        </button>
                    ))}
                </div>
            </div>

            {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs font-medium text-error hover:underline">
                    Clear all filters
                </button>
            )}
        </div>
    )

    return (
        <div className="bg-bg-ivory min-h-screen">
            <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
                <div className="mb-6">
                    <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text-main mb-2">
                        Find Local Markets
                    </h1>
                    <p className="text-text-secondary text-sm sm:text-base">
                        Explore farmers markets around you, check locations and plan your pickup.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1 flex items-center gap-2 rounded-full border border-line bg-surface-cream px-4 py-2.5">
                        <Search size={18} className="text-text-secondary shrink-0" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search markets, area or address..."
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-secondary"
                        />
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="lg:hidden flex items-center justify-center gap-2 rounded-full border border-line bg-surface-cream px-4 py-2.5 text-sm font-medium"
                    >
                        <SlidersHorizontal size={16} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[10px] text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                <div className="lg:hidden flex items-center gap-2 mb-4">
                    <button
                        onClick={() => setMobileView('list')}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium border transition-colors ${mobileView === 'list' ? 'bg-forest text-white border-forest' : 'border-line text-text-main'
                            }`}
                    >
                        <List size={15} /> List
                    </button>
                    <button
                        onClick={() => setMobileView('map')}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium border transition-colors ${mobileView === 'map' ? 'bg-forest text-white border-forest' : 'border-line text-text-main'
                            }`}
                    >
                        <MapIcon size={15} /> Map
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
                    <aside className="hidden lg:block">{FilterPanel}</aside>

                    {isFilterOpen && (
                        <div className="lg:hidden fixed inset-0 z-50 flex">
                            <div className="absolute inset-0 bg-charcoal/40" onClick={() => setIsFilterOpen(false)} />
                            <div className="relative ml-auto h-full w-72 bg-surface-cream p-5 overflow-y-auto">
                                <div className="flex items-center justify-between mb-5">
                                    <p className="font-semibold text-text-main">Filters</p>
                                    <button onClick={() => setIsFilterOpen(false)} aria-label="Close filters">
                                        <X size={18} />
                                    </button>
                                </div>
                                {FilterPanel}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
                        {/* List */}
                        <div className={cn('space-y-3', mobileView === 'map' && 'hidden lg:block')}>
                            {isError ? (
                                <p className="text-sm text-error text-center py-10">Couldn't load markets.</p>
                            ) : isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => <MarketCardSkeleton key={i} />)
                            ) : markets.length === 0 ? (
                                <p className="text-sm text-text-secondary text-center py-10">No markets found.</p>
                            ) : (
                                <>
                                    <p className="text-sm text-text-secondary mb-1">{markets.length} markets found</p>
                                    {markets.map((market) => (
                                        <div
                                            key={market.id}
                                            id={`market-card-${market.id}`}
                                            onClick={() => setSelectedMarketId(market.id)}
                                            className={cn(
                                                'rounded-2xl border bg-surface-cream p-4 transition-colors cursor-pointer',
                                                selectedMarketId === market.id ? 'border-forest bg-forest/5' : 'border-line hover:border-forest/40'
                                            )}
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                                <p className="text-sm font-semibold text-text-main">{market.name}</p>
                                                {market.distanceKm != null && (
                                                    <span className="text-xs font-medium text-amber-dark shrink-0">
                                                        {market.distanceKm.toFixed(1)} km
                                                    </span>
                                                )}
                                            </div>
                                            <p className="flex items-center gap-1 text-xs text-text-secondary mb-2">
                                                <MapPin size={11} />
                                                {market.address}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
                                                <span>{market.operatingDays.join(', ')} · {market.openingTime} – {market.closingTime}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1 text-xs text-text-secondary">
                                                    <Users size={12} />
                                                    {market.farmers} Farmers
                                                </span>
                                                <Link
                                                    to={`/markets/${market.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded-full bg-forest px-4 py-1.5 text-xs font-medium text-white hover:bg-forest-dark transition-colors"
                                                >
                                                    View Market
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Map */}
                        <div className={cn('rounded-3xl overflow-hidden min-h-[400px] lg:min-h-full', mobileView === 'list' && 'hidden lg:block')}>
                            {!isLoading && markets && (
                                <MarketMap
                                    userLocation={location}
                                    markets={markets}
                                    selectedMarketId={selectedMarketId}
                                    onSelectMarket={(id) => {
                                        setSelectedMarketId(id)
                                        // Scroll the matching list card into view when a pin is clicked
                                        document.getElementById(`market-card-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                                    }}
                                    renderPopup={(market) => (
                                        <div className="text-sm">
                                            <p className="font-medium text-text-main">{market.name}</p>
                                            <p className="text-xs text-text-secondary mb-1">{market.address}</p>
                                            {market.distanceKm != null && (
                                                <p className="text-xs text-amber-dark font-medium mb-1.5">
                                                    {market.distanceKm.toFixed(1)} km away
                                                </p>
                                            )}
                                            <Link to={`/markets/${market.id}`} className="text-xs font-medium text-forest hover:underline">
                                                View Market →
                                            </Link>
                                        </div>
                                    )}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}