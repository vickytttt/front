import { useEffect, useState } from 'react'
import WeatherIcon from './WeatherIcon.jsx'
import Forecast from './Forecast.jsx'
import { describeWeather } from '../api/openMeteo.js'

// One location's live weather card.
// Props: loc {name,country,lat,lon}, weather | null, error | null, unit 'C'|'F', onRemove
export default function LocationCard({ loc, weather, error, unit, onRemove }) {
  const toF = (c) => Math.round((c * 9) / 5 + 32)

  // Live clock for this location's timezone. Open-Meteo returns the IANA
  // timezone ("Europe/Stockholm"), which we use to convert the browser's
  // current instant into the location's local wall-clock time. This is
  // accurate and ticks each minute — unlike the API's `current.time`, which
  // is only the forecast interval start (e.g. 19:00) rather than the real
  // time.
  const [localTime, setLocalTime] = useState('')
  useEffect(() => {
    if (!weather?.timezone) return
    const format = () => {
      try {
        setLocalTime(
          new Intl.DateTimeFormat(undefined, {
            timeZone: weather.timezone,
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date())
        )
      } catch {
        setLocalTime('')
      }
    }
    format()
    const id = setInterval(format, 60_000) // tick each minute
    return () => clearInterval(id)
  }, [weather?.timezone])

  return (
    <article className="location-card">
      <div className="location-card__head">
        <div>
          <h3 className="location-card__city">{loc.name}</h3>
          {loc.country && <p className="location-card__country">{loc.country}</p>}
          {localTime && (
            <p className="location-card__time">🕐 {localTime} · local time</p>
          )}
        </div>
        {onRemove && (
          <button
            className="location-card__remove"
            onClick={onRemove}
            aria-label="Remove location"
          >
            ×
          </button>
        )}
      </div>

      {!weather && !error && <p className="location-card__status">Loading live data…</p>}
      {error && <p className="location-card__status location-card__status--error">{error}</p>}

      {weather && (
        <>
          {(() => {
            const temp = unit === 'F' ? toF(weather.temp) : weather.temp
            const feels = unit === 'F' ? toF(weather.feels_like) : weather.feels_like
            const { icon, label } = describeWeather(weather.code)
            return (
              <>
                <div className="location-card__current">
                  <div>
                    <p className="location-card__temp">{temp}°{unit}</p>
                    <p className="location-card__desc">{label} · Feels {feels}°{unit}</p>
                  </div>
                  <WeatherIcon icon={icon} alt={label} />
                </div>
              </>
            )
          })()}

          <ul className="location-card__stats">
            <li>
              <span className="location-card__label">Humidity</span>
              <span className="location-card__value">{weather.humidity}%</span>
            </li>
            <li>
              <span className="location-card__label">Wind</span>
              <span className="location-card__value">{weather.wind} m/s</span>
            </li>
          </ul>

          <Forecast daily={weather.daily} />
        </>
      )}
    </article>
  )
}
