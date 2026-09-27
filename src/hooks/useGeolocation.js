import { useState, useEffect } from 'react'

/**
 * Requests the browser's geolocation once on mount (if permission allows).
 * Returns { location: [lat, lng] | null, status: 'idle' | 'loading' | 'granted' | 'denied' | 'unsupported' }
 * Consumers can also call `requestLocation()` manually (e.g. from a "Use my location" button).
 */
export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [status, setStatus] = useState('idle')

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus('unsupported')
      return
    }
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude])
        setStatus('granted')
      },
      () => setStatus('denied'),
      { timeout: 8000 }
    )
  }

  useEffect(() => {
    requestLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { location, status, requestLocation }
}