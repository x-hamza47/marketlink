import { useEffect, useState } from 'react'

/**
 * Returns a "debounced" copy of a value — one that only updates after
 * the input has stopped changing for `delay` milliseconds.
 *
 * Usage: const debouncedSearch = useDebounce(search, 400)
 * Effects that depend on debouncedSearch (like firing an API call)
 * only run once typing pauses, not on every keystroke.
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: if `value` changes again before the timer fires,
    // cancel the pending timer and start a fresh one. This is what
    // creates the "wait until typing pauses" behavior.
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}