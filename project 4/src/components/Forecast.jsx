import WeatherIcon from './WeatherIcon.jsx'
import { describeWeather } from '../api/openMeteo.js'

// Compact day-by-day forecast strip.
// Props: daily = [ {date, code, tempMin, tempMax} ]
export default function Forecast({ daily }) {
  return (
    <ul className="mini-forecast">
      {daily.map((day) => {
        const { icon, label } = describeWeather(day.code)
        return (
          <li className="mini-forecast__day" key={day.date}>
            <span className="mini-forecast__date">{weekday(day.date)}</span>
            <WeatherIcon icon={icon} alt={label} />
            <span className="mini-forecast__temps">
              {day.tempMax}° / {day.tempMin}°
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function weekday(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short' })
}
