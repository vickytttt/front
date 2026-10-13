// Small reusable icon component.
// Props: icon (OpenWeatherMap icon id), alt (human description).
export default function WeatherIcon({ icon, alt }) {
  return (
    <img
      className="weather-icon"
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt={alt}
      width="80"
      height="80"
    />
  )
}
