import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom branded marker — replaces Leaflet's default icon.
const marketIcon = new L.DivIcon({
  className: 'custom-market-marker',
  html: `<div style="
    width: 16px; height: 16px; border-radius: 50%;
    background: #1F4D3A; border: 2px solid #FFFEFA;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const activeMarketIcon = new L.DivIcon({
  className: 'custom-market-marker-active',
  html: `<div style="
    width: 22px; height: 22px; border-radius: 50%;
    background: #D6A84F; border: 3px solid #FFFEFA;
    box-shadow: 0 2px 8px rgba(0,0,0,0.35);
  "></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

// Recenters the map when the selected market changes.
function MapRecenter({ center }) {
  const map = useMap()
  if (center) map.setView(center, 14, { animate: true })
  return null
}

export default function MarketMap({ markets, selectedMarketId, onSelectMarket }) {
  const defaultCenter = [24.86, 67.05] // Karachi

  const selected = markets.find((m) => m.id === selectedMarketId)

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-line">
      <MapContainer center={defaultCenter} zoom={11} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selected && <MapRecenter center={[selected.lat, selected.lng]} />}
        {markets.map((market) => (
          <Marker
            key={market.id}
            position={[market.lat, market.lng]}
            icon={market.id === selectedMarketId ? activeMarketIcon : marketIcon}
            eventHandlers={{ click: () => onSelectMarket(market.id) }}
          >
            <Popup>
              <p className="font-medium">{market.name}</p>
              <p className="text-xs text-text-secondary">{market.address}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}