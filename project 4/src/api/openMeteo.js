// Live weather data via Open-Meteo — free, no API key required.
// Docs: https://open-meteo.com/en/docs

// The four preset locations (fixed coordinates).
export const PRESET_LOCATIONS = [
  { name: 'Stockholm', country: 'Sweden', lat: 59.3293, lon: 18.0686 },
  { name: 'Moscow', country: 'Russia', lat: 55.7558, lon: 37.6173 },
  { name: 'Oslo', country: 'Norway', lat: 59.9139, lon: 10.7522 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
]

// WMO weather code -> OpenWeatherMap icon + label.
// (icon image URLs are public and need no API key.)
const WMO = {
  0:  { icon: '01d', label: 'Clear sky' },
  1:  { icon: '02d', label: 'Mainly clear' },
  2:  { icon: '03d', label: 'Partly cloudy' },
  3:  { icon: '04d', label: 'Overcast' },
  45: { icon: '50d', label: 'Fog' },
  48: { icon: '50d', label: 'Rime fog' },
  51: { icon: '09d', label: 'Light drizzle' },
  53: { icon: '09d', label: 'Drizzle' },
  55: { icon: '09d', label: 'Heavy drizzle' },
  56: { icon: '09d', label: 'Freezing drizzle' },
  57: { icon: '09d', label: 'Heavy freezing drizzle' },
  61: { icon: '10d', label: 'Light rain' },
  63: { icon: '10d', label: 'Rain' },
  65: { icon: '10d', label: 'Heavy rain' },
  66: { icon: '10d', label: 'Cold rain' },
  67: { icon: '10d', label: 'Heavy cold rain' },
  71: { icon: '13d', label: 'Light snow' },
  73: { icon: '13d', label: 'Snow' },
  75: { icon: '13d', label: 'Heavy snow' },
  77: { icon: '13d', label: 'Snow grains' },
  80: { icon: '10d', label: 'Light showers' },
  81: { icon: '10d', label: 'Shower rain' },
  82: { icon: '10d', label: 'Violent showers' },
  85: { icon: '13d', label: 'Light snow showers' },
  86: { icon: '13d', label: 'Snow showers' },
  95: { icon: '11d', label: 'Thunderstorm' },
  96: { icon: '11d', label: 'Thunderstorm with hail' },
  99: { icon: '11d', label: 'Thunderstorm with hail' },
}

export function describeWeather(code) {
  return WMO[code] || { icon: '01d', label: 'Unknown' }
}

// Cap for any computed delay so a bad Retry-After value can't wedge us.
const MAX_RETRY_DELAY_MS = 30_000

// Wrap fetch to retry transient failures.
//
// We retry on network errors (offline, aborted connection) and on responses
// the server flagged as transient — 429 (Too Many Requests) and any 5xx.
// A 4xx like 404/401 won't fix itself by repeating, so we don't retry those;
// they surface to the caller as-is.
//
// Backoff is exponential with a little jitter to spread concurrent retries,
// and a Retry-After header (seconds) is honored when the server provides one.
async function fetchWithRetry(url, options = {}, { retries = 3 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options)

      if (res.ok) return res

      // Only rate-limit / server errors are worth retrying.
      if (res.status === 429 || res.status >= 500) {
        if (attempt >= retries) return res // gave up — let caller see the error

        // Honor Retry-After (in seconds) if present AND positive, else
        // exponential backoff. Note: Number(null) === 0, so we must guard
        // against an absent header (and a meaningless Retry-After: 0) before
        // trusting the value — otherwise we'd retry instantly.
        const retryAfter = res.headers.get('Retry-After')
        const retryAfterSec =
          typeof retryAfter === 'string' && retryAfter.trim() !== ''
            ? Number(retryAfter)
            : NaN
        const backoff = Math.min(MAX_RETRY_DELAY_MS, 1000 * 2 ** attempt)
        const delay =
          Number.isFinite(retryAfterSec) && retryAfterSec > 0
            ? Math.min(retryAfterSec * 1000, MAX_RETRY_DELAY_MS)
            : backoff

        // Small jitter so several cards retrying at once don't collide.
        await new Promise((resolve) => setTimeout(resolve, delay + Math.random() * 500))
        continue
      }

      return res // non-retryable status (e.g. 404)
    } catch (err) {
      // Network-level failure: back off and retry before giving up.
      if (attempt < retries) {
        const delay = Math.min(MAX_RETRY_DELAY_MS, 1000 * 2 ** attempt) + Math.random() * 500
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }
      throw err
    }
  }
}

// Turn a city name into coordinates via OpenStreetMap (free, no API key).
// Rate limit: ~1 request/second — fine for a search box.
export async function geocode(query) {
  const url =
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`
  const res = await fetchWithRetry(url, { headers: { 'User-Agent': 'WeatherDashboard/1.0' } })
  const data = await res.json()
  const result = data?.[0]
  if (!result) throw new Error('City not found — check the spelling.')

  const country = resolveCountry(result)

  return {
    name: result.name,
    country,
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
  }
}

// ISO 3166-1 alpha-2 -> English country name, so searched cities show the
// same English names used by the preset locations (e.g. "Finland", not
// "Suomi"). Covers the common cases; anything unknown falls through to a
// best-effort parse below.
const COUNTRY_CODES = {
  ad: 'Andorra', ae: 'United Arab Emirates', af: 'Afghanistan', ag: 'Antigua and Barbuda', al: 'Albania', am: 'Armenia', ao: 'Angola', ar: 'Argentina', at: 'Austria', au: 'Australia', az: 'Azerbaijan',
  ba: 'Bosnia and Herzegovina', bb: 'Barbados', bh: 'Bahrain', bi: 'Burundi', bj: 'Benin', bn: 'Brunei', bo: 'Bolivia', br: 'Brazil', bs: 'Bahamas', bt: 'Bhutan', bw: 'Botswana', by: 'Belarus', bz: 'Belize',
  ca: 'Canada', cd: 'Democratic Republic of the Congo', cf: 'Central African Republic', cg: 'Republic of the Congo', ch: 'Switzerland', ci: 'Côte d’Ivoire', cl: 'Chile', cm: 'Cameroon', cn: 'China', co: 'Colombia', cr: 'Costa Rica', cu: 'Cuba', cv: 'Cape Verde',
  cy: 'Cyprus', cz: 'Czechia', de: 'Germany', dj: 'Djibouti', dk: 'Denmark', dm: 'Dominica', do: 'Dominican Republic', dz: 'Algeria',
  ec: 'Ecuador', ee: 'Estonia', eg: 'Egypt', er: 'Eritrea', es: 'Spain', et: 'Ethiopia', fi: 'Finland', fj: 'Fiji', fm: 'Micronesia', fr: 'France',
  ga: 'Gabon', gb: 'United Kingdom', gd: 'Grenada', ge: 'Georgia', gf: 'French Guiana', gh: 'Ghana', gi: 'Gibraltar', gm: 'Gambia', gn: 'Guinea', gp: 'Guadeloupe', gq: 'Equatorial Guinea', gr: 'Greece', gt: 'Guatemala', gu: 'Guam', gy: 'Guyana',
  hk: 'Hong Kong', hn: 'Honduras', hr: 'Croatia', ht: 'Haiti', hu: 'Hungary',
  id: 'Indonesia', ie: 'Ireland', il: 'Israel', in: 'India', io: 'British Indian Ocean Territory', iq: 'Iraq', ir: 'Iran', is: 'Iceland', it: 'Italy',
  jm: 'Jamaica', jo: 'Jordan', jp: 'Japan',
  ke: 'Kenya', kg: 'Kyrgyzstan', kh: 'Cambodia', ki: 'Kiribati', km: 'Comoros', kn: 'Saint Kitts and Nevis', kp: 'North Korea', kr: 'South Korea', kw: 'Kuwait', kz: 'Kazakhstan',
  la: 'Laos', lb: 'Lebanon', lc: 'Saint Lucia', li: 'Liechtenstein', lk: 'Sri Lanka', lr: 'Liberia', ls: 'Lesotho', lt: 'Lithuania', lu: 'Luxembourg', lv: 'Latvia', ly: 'Libya',
  ma: 'Morocco', mc: 'Monaco', md: 'Moldova', me: 'Montenegro', mg: 'Madagascar', mh: 'Marshall Islands', mk: 'North Macedonia', ml: 'Mali', mm: 'Myanmar', mn: 'Mongolia', mr: 'Mauritania', mt: 'Malta', mu: 'Mauritius', mv: 'Maldives', mw: 'Malawi', mx: 'Mexico', my: 'Malaysia', mz: 'Mozambique',
  na: 'Namibia', nc: 'New Caledonia', ne: 'Niger', ng: 'Nigeria', ni: 'Nicaragua', nl: 'Netherlands', no: 'Norway', np: 'Nepal', nr: 'Nauru', nu: 'Niue', nz: 'New Zealand',
  om: 'Oman', pa: 'Panama', pe: 'Peru', pg: 'Papua New Guinea', ph: 'Philippines', pk: 'Pakistan', pl: 'Poland', pr: 'Puerto Rico', pt: 'Portugal', py: 'Paraguay',
  qa: 'Qatar', ro: 'Romania', rs: 'Serbia', ru: 'Russia', rw: 'Rwanda',
  sa: 'Saudi Arabia', sb: 'Solomon Islands', sc: 'Seychelles', sd: 'Sudan', se: 'Sweden', sg: 'Singapore', si: 'Slovenia', sk: 'Slovakia', sl: 'Sierra Leone', sm: 'San Marino', sn: 'Senegal', so: 'Somalia', sr: 'Suriname', ss: 'South Sudan', st: 'São Tomé and Príncipe', sv: 'El Salvador', sy: 'Syria', sz: 'Eswatini',
  tc: 'Turks and Caicos Islands', td: 'Chad', tg: 'Togo', th: 'Thailand', tj: 'Tajikistan', tl: 'Timor-Leste', tm: 'Turkmenistan', tn: 'Tunisia', to: 'Tonga', tr: 'Turkey', tt: 'Trinidad and Tobago', tv: 'Tuvalu', tw: 'Taiwan', tz: 'Tanzania',
  ua: 'Ukraine', ug: 'Uganda', us: 'United States', uy: 'Uruguay', uz: 'Uzbekistan',
  va: 'Vatican City', vc: 'Saint Vincent and the Grenadines', ve: 'Venezuela', vn: 'Vietnam', vu: 'Vanuatu',
  ws: 'Samoa', ye: 'Yemen', za: 'South Africa', zm: 'Zambia', zw: 'Zimbabwe',
}

function resolveCountry(result) {
  const code = (result.address?.country_code || '').toLowerCase()
  if (code && COUNTRY_CODES[code]) return COUNTRY_CODES[code]

  // No usable code: take the address country, preferring the English piece
  // when it lists both (e.g. "Suomi / Finland" -> "Finland").
  let country = result.address?.country
  if (country && country.includes('/')) {
    country = country.split('/').map((s) => s.trim()).filter(Boolean).pop()
  }
  if (!country) {
    const parts = (result.display_name || '').split(',')
    country = parts.length > 1 ? parts[parts.length - 1].trim() : ''
  }
  return country
}

// Fetch current weather + 5-day forecast for coordinates.
// All temperatures are in Celsius; convert client-side for °F.
export async function getLiveWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&forecast_days=5&timezone=auto&wind_speed_unit=ms`

  const res = await fetchWithRetry(url)
  if (!res.ok) throw new Error('Could not reach the weather service.')

  const data = await res.json()
  return {
    temp: Math.round(data.current.temperature_2m),
    feels_like: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    wind: data.current.wind_speed_10m,
    code: data.current.weather_code,
    time: data.current.time,
    timezone: data.timezone, // IANA name, e.g. "Europe/Stockholm"
    daily: data.daily.time.map((date, i) => ({
      date,
      code: data.daily.weather_code[i],
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
    })),
  }
}
