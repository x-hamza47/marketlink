// src/components/public/MarketPreviewMap.jsx
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function pinIcon(color, size = 28) {
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
  })
}

const marketIcon = pinIcon('#1F4D3A', 26)
const nearestMarketIcon = pinIcon('#D6A84F', 32)

const youAreHereIcon = new L.DivIcon({
  className: 'custom-user-location',
  html: `
    <div style="position: relative; width: 18px; height: 18px;">
      <div style="position: absolute; inset: -8px; border-radius: 50%; background: rgba(66,133,244,0.2);"></div>
      <div style="position: absolute; inset: 0; width: 18px; height: 18px; border-radius: 50%; background: #4285F4; border: 3px solid #FFFEFA; box-shadow: 0 1px 4px rgba(0,0,0,0.4);"></div>
    </div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

export default function MarketPreviewMap({ markets = [], userLocation, nearestMarketId }) {
  const center = userLocation || (markets[0] ? [markets[0].lat, markets[0].lng] : [24.86, 67.05])

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userLocation && <Marker position={userLocation} icon={youAreHereIcon} />}

        {markets.map((market) => (
          <Marker
            key={market._id}
            position={[market.lat, market.lng]}
            icon={market._id === nearestMarketId ? nearestMarketIcon : marketIcon}
          />
        ))}
      </MapContainer>
    </div>
  )
}