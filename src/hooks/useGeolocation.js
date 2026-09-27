import { useState, useEffect } from 'react'

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
  }, [])

  return { location, status, requestLocation }
}