/**
 * Geocoding via OpenStreetMap's Nominatim API — free, no API key required.
 * Used to convert an address search into map coordinates for the
 * Admin "Add Market" location picker.
 *
 * Nominatim's usage policy asks for reasonable request rates — we handle
 * this by debouncing the search input (see useDebounce), not firing a
 * request per keystroke.
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'

/**
 * Searches for a location by free-text address.
 * Returns an array of { label, lat, lng } results.
 */
export async function searchLocation(query) {
  if (!query || query.trim().length < 3) return []

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '5',
    addressdetails: '1',
  })

  const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
    headers: {
      // Nominatim's usage policy asks apps to identify themselves.
      'Accept-Language': 'en',
    },
  })

  if (!response.ok) {
    throw new Error('Location search failed')
  }

  const results = await response.json()

  return results.map((r) => ({
    label: r.display_name,
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
  }))
}

/**
 * Reverse geocoding — converts coordinates back into a readable address.
 * Used when the admin clicks/drags a pin directly on the map.
 */
export async function reverseGeocode(lat, lng) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
  })

  const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params}`, {
    headers: { 'Accept-Language': 'en' },
  })

  if (!response.ok) {
    throw new Error('Reverse geocoding failed')
  }

  const result = await response.json()
  return result.display_name || ''
}