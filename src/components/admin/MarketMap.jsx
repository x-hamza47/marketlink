import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useGeolocation } from '@/hooks/useGeolocation'

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

const userLocationIcon = new L.DivIcon({
  className: 'custom-user-marker',
  html: `<div style="
    width: 14px; height: 14px; border-radius: 50%;
    background: #3B82F6; border: 3px solid #FFFEFA;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.25);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const droppedPinIcon = new L.DivIcon({
  className: 'custom-dropped-pin',
  html: `<div style="
    width: 24px; height: 24px; border-radius: 50% 50% 50% 0;
    background: #B33A3A; border: 2px solid #FFFEFA;
    transform: rotate(-45deg);
    box-shadow: 0 2px 6px rgba(0,0,0,0.35);
  "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
})

import { useEffect } from 'react'

// Recenters the map when the selected market changes.
function MapRecenter({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center && center[0] != null && center[1] != null && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, 14, { animate: true, duration: 0.8 })
    }
  }, [center, map])
  return null
}


function DropPinHandler({ onDrop }) {
  useMapEvents({
    click: (e) => onDrop([e.latlng.lat, e.latlng.lng]),
  })
  return null
}

export default function MarketMap({ markets = [], selectedMarketId, onSelectMarket }) {
  const defaultCenter = [24.86, 67.05] // Karachi
  const { location, status } = useGeolocation()
  const [droppedPin, setDroppedPin] = useState(null)

  const selected = markets.find((m) => (m._id || m.id) === selectedMarketId)
  const selectedCoords = selected
    ? [
        selected.lat ?? selected.location?.coordinates?.[1],
        selected.lng ?? selected.location?.coordinates?.[0],
      ]
    : null
  const userCenter = status === 'granted' ? location : null

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-line">
      <MapContainer
        center={userCenter || defaultCenter}
        zoom={userCenter ? 13 : 11}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DropPinHandler onDrop={setDroppedPin} />

        {selectedCoords && selectedCoords[0] != null && selectedCoords[1] != null && (
          <MapRecenter center={selectedCoords} />
        )}

        {userCenter && (
          <Marker position={userCenter} icon={userLocationIcon}>
            <Popup>Your location</Popup>
          </Marker>
        )}

        {droppedPin && (
          <Marker position={droppedPin} icon={droppedPinIcon}>
            <Popup>
              Dropped pin
              <br />
              {droppedPin[0].toFixed(5)}, {droppedPin[1].toFixed(5)}
            </Popup>
          </Marker>
        )}

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