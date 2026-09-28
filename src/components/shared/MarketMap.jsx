import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function pinIcon(color, size = 32) {
  return new L.DivIcon({
    className: 'custom-market-pin',
    html: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35));">
        <path d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 15 9 15s9-8.25 9-15c0-4.97-4.03-9-9-9z"/>
        <circle cx="12" cy="9" r="3.5" fill="white"/>
      </svg>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size], 
    popupAnchor: [0, -size],
  })
}

const marketIcon = pinIcon('#1F4D3A', 30)
const activeMarketIcon = pinIcon('#D6A84F', 38)

const userLocationIcon = new L.DivIcon({
  className: 'custom-user-location',
  html: `
    <div style="position: relative; width: 22px; height: 22px;">
      <div style="
        position: absolute; inset: -10px;
        border-radius: 50%;
        background: rgba(66, 133, 244, 0.2);
      "></div>
      <div style="
        position: absolute; inset: 0;
        width: 22px; height: 22px; border-radius: 50%;
        background: #4285F4; border: 3px solid #FFFFFF;
        box-shadow: 0 1px 4px rgba(0,0,0,0.4);
      "></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

function MapRecenter({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center && center[0] != null && center[1] != null && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, 14, { animate: true, duration: 0.8 })
    }
  }, [center, map])
  return null
}

export default function MarketMap({ markets = [], selectedMarketId, onSelectMarket, renderPopup, userLocation }) {
  const defaultCenter = userLocation || [24.86, 67.05]
  const selected = markets.find((m) => (m._id || m.id) === selectedMarketId)
  const selectedCoords = selected
    ? [
        selected.lat ?? selected.location?.coordinates?.[1],
        selected.lng ?? selected.location?.coordinates?.[0],
      ]
    : null

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-line">
      <MapContainer center={defaultCenter} zoom={11} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedCoords && selectedCoords[0] != null && selectedCoords[1] != null && (
          <MapRecenter center={selectedCoords} />
        )}

        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {markets.map((market) => {
          const marketId = market._id || market.id
          const lat = market.lat ?? market.location?.coordinates?.[1]
          const lng = market.lng ?? market.location?.coordinates?.[0]
          if (lat == null || lng == null) return null

          const isSelected = marketId === selectedMarketId

          return (
            <Marker
              key={marketId}
              position={[lat, lng]}
              icon={isSelected ? activeMarketIcon : marketIcon}
              eventHandlers={{ click: () => onSelectMarket?.(marketId) }}
            >
              <Popup>
                {renderPopup ? renderPopup(market) : (
                  <>
                    <p className="font-medium">{market.name}</p>
                    <p className="text-xs text-text-secondary">{market.address}</p>
                  </>
                )}
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}