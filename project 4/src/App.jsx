import { useEffect, useRef, useState } from 'react'
import { PRESET_LOCATIONS, geocode, getLiveWeather } from './api/openMeteo.js'
import LocationCard from './components/LocationCard.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import './App.css'

// Live weather dashboard: four preset cities + search to add more.
// No API key needed — data comes from Open-Meteo.
export default function App() {
  // Persist locations across reloads via localStorage.
  const [locations, setLocations] = useLocalStorage('weather.locations', PRESET_LOCATIONS)
  const [weather, setWeather] = useState({}) // cache: `${lat}-${lon}` -> data
  const [errors, setErrors] = useState({}) // cache: `${lat}-${lon}` -> message
  const [query, setQuery] = useState('')
  const [unit, setUnit] = useState('C')

  // Guard against duplicate in-flight requests. React 18 StrictMode
  // double-invokes effects in development, which would otherwise fire two
  // identical requests per city before the first one commits.
  const inFlight = useRef(new Set())

  const cacheKey = (loc) => `${loc.lat}-${loc.lon}`

  const load = async (loc) => {
    const key = cacheKey(loc)
    if (weather[key] || errors[key] || inFlight.current.has(key)) return // already loaded, errored, or loading
    inFlight.current.add(key)
    try {
      const data = await getLiveWeather(loc.lat, loc.lon)
      setWeather((prev) => ({ ...prev, [key]: data }))
    } catch (err) {
      setErrors((prev) => ({ ...prev, [key]: err.message }))
    } finally {
      inFlight.current.delete(key)
    }
  }

  // Load the four preset locations on first render.
  useEffect(() => {
    locations.forEach(load)
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    try {
      const found = await geocode(q)
      if (locations.some((l) => l.lat === found.lat && l.lon === found.lon)) return
      setLocations((prev) => [...prev, found])
      await load(found)
      setQuery('')
    } catch (err) {
      alert(err.message)
    }
  }

  const removeLocation = (loc) => {
    const key = cacheKey(loc)
    setLocations((prev) => prev.filter((l) => !(l.lat === loc.lat && l.lon === loc.lon)))
    setWeather((prev) => { const next = { ...prev }; delete next[key]; return next })
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next })
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">🌤️ Weather Dashboard</h1>
        <p className="app__subtitle">Live weather for four cities — search to add more.</p>

        <div className="app__top">
          <form className="search" onSubmit={handleSearch}>
            <input
              className="search__input"
              type="text"
              value={query}
              placeholder="Add a city…"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search__btn" type="submit">Add</button>
          </form>

          <div className="unit-toggle" role="group" aria-label="Temperature unit">
            <button
              className={`unit-toggle__btn${unit === 'C' ? ' active' : ''}`}
              onClick={() => setUnit('C')}
              aria-pressed={unit === 'C'}
            >
              °C
            </button>
            <button
              className={`unit-toggle__btn${unit === 'F' ? ' active' : ''}`}
              onClick={() => setUnit('F')}
              aria-pressed={unit === 'F'}
            >
              °F
            </button>
          </div>
        </div>
      </header>

      <section className="locations">
        <ul className="locations__grid">
          {locations.map((loc) => (
            <li key={`${loc.lat}-${loc.lon}`}>
              <LocationCard
                loc={loc}
                weather={weather[cacheKey(loc)] || null}
                error={errors[cacheKey(loc)] || null}
                unit={unit}
                onRemove={() => removeLocation(loc)}
              />
            </li>
          ))}
        </ul>
      </section>

      <footer className="app__footer">
        Live weather by <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo</a> ·
        Search by <a href="https://openstreetmap.org" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>
      </footer>
    </main>
  )
}
