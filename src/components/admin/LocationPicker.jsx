import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Search, Loader2, MapPin } from 'lucide-react'
import { searchLocation, reverseGeocode } from '@/services/geocodingService'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'

const pinIcon = new L.DivIcon({
  className: 'custom-pin-marker',
  html: `<div style="
    width: 26px; height: 26px; border-radius: 50% 50% 50% 0;
    background: #1F4D3A; border: 2px solid #FFFEFA;
    transform: rotate(-45deg);
    box-shadow: 0 2px 6px rgba(0,0,0,0.35);
  "></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
})

// Listens for map clicks and drag-end on the marker, reports new coordinates up.
function ClickAndDragHandler({ onLocationChange }) {
  useMapEvents({
    click: (e) => {
      onLocationChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// Recenters/zooms the map whenever the pin's coordinates change externally
// (e.g. from a search result selection), not just on initial mount.
function MapRecenter({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    if (lat != null && lng != null) {
      map.setView([lat, lng], 15, { animate: true })
    }
  }, [lat, lng, map])
  return null
}

/**
 * LocationPicker — address search (geocoding) + interactive map with a
 * draggable pin. Both interactions converge on the same lat/lng state,
 * which the parent form reads via onChange.
 *
 * Usage:
 * <LocationPicker
 *   value={{ lat, lng, address }}
 *   onChange={({ lat, lng, address }) => ...}
 * />
 */
export default function LocationPicker({ value, onChange }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const debouncedQuery = useDebounce(query, 500)

  // Fires the geocoding search whenever the debounced query changes.
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 3) {
      setResults([])
      return
    }

    let cancelled = false
    setIsSearching(true)

    searchLocation(debouncedQuery)
      .then((res) => {
        if (!cancelled) {
          setResults(res)
          setShowResults(true)
        }
      })
      .catch(() => {
        if (!cancelled) setResults([])
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false)
      })

    // Cleanup: if the query changes again before this request resolves,
    // ignore the stale response when it eventually comes back.
    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  function handleSelectResult(result) {
    setQuery(result.label)
    setShowResults(false)
    onChange({ lat: result.lat, lng: result.lng, address: result.label })
  }

  async function handleMapLocationChange(lat, lng) {
    onChange({ lat, lng, address: value.address }) // update pin immediately
    try {
      const address = await reverseGeocode(lat, lng)
      onChange({ lat, lng, address }) // then fill in the address once resolved
    } catch {
      // Reverse geocoding failed — keep the coordinates, just skip the address fill.
    }
  }

  const hasPin = value?.lat != null && value?.lng != null
  const center = hasPin ? [value.lat, value.lng] : [24.86, 67.05] // default: Karachi

  return (
    <div className="space-y-2">
      {/* Search box */}
      <div className="relative">
        <div className="flex items-center gap-2 px-3 h-10 rounded-md border border-line bg-surface-cream">
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-text-secondary animate-spin shrink-0" />
          ) : (
            <Search className="w-4 h-4 text-text-secondary shrink-0" strokeWidth={1.75} />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Search for an address…"
            className="bg-transparent outline-none text-sm w-full placeholder:text-text-secondary/70"
          />
        </div>

        {showResults && results.length > 0 && (
          <div className="absolute z-9999 top-full mt-1 w-full bg-surface-cream border border-line rounded-md shadow-lg max-h-56 overflow-y-auto">
            {results.map((result, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectResult(result)}
                className="w-full flex items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-bg-ivory transition-colors border-b border-line/40 last:border-0"
              >
                <MapPin className="w-3.5 h-3.5 text-forest mt-0.5 shrink-0" strokeWidth={1.75} />
                <span className="text-text-main">{result.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-text-secondary">
        Or click directly on the map to place a pin.
      </p>

      {/* Interactive map */}
      <div className="h-64 rounded-md overflow-hidden border border-line">
        <MapContainer center={center} zoom={hasPin ? 14 : 11} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickAndDragHandler onLocationChange={handleMapLocationChange} />
          {hasPin && <MapRecenter lat={value.lat} lng={value.lng} />}
          {hasPin && (
            <Marker
              position={[value.lat, value.lng]}
              icon={pinIcon}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng()
                  handleMapLocationChange(lat, lng)
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      {hasPin && (
        <p className={cn('text-xs text-text-secondary')}>
          Pin: {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
        </p>
      )}
    </div>
  )
}