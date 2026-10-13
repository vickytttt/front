import { useCallback, useEffect, useState } from 'react'

// State that survives a page reload by staying in sync with localStorage.
// Pass an initialState (value or () => value) to seed it the first time.
export function useLocalStorage(key, initialState) {
  const [value, setValue] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key))
      return stored === undefined || stored === null ? initialState : stored
    } catch {
      // Corrupted / unavailable storage: fall back to the provided default.
      return typeof initialState === 'function' ? initialState() : initialState
    }
  })

  // Write through to localStorage whenever the value changes.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore quota / unavailable-storage errors.
    }
  }, [key, value])

  // Remove the key entirely (e.g. when clearing).
  const clear = useCallback(() => {
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignore.
    }
  }, [key])

  return [value, setValue, clear]
}
