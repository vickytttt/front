# 🌤️ Weather Dashboard

A small, responsive **Weather Dashboard** built with **React + Vite**. Four cities are
shown at a glance with **live** weather and a short forecast, and you can search to add
more. No API key required — data comes from free, open sources.

## 💡 The idea

- **What:** A single-page weather dashboard.
- **Who:** Anyone who wants a quick, no-clutter weather snapshot.
- **Problem it solves:** Replaces busy weather sites with a clean grid of cards — one
  per location — each showing current conditions and the upcoming days.
- **Main features:** Live weather for four preset cities, search to add more, °C/°F
  toggle, and a per-card forecast.

## ✨ Features

- 🌍 **Live data** for four preset cities: Stockholm, Moscow, Oslo, and London.
- 🔍 Search any city to add it to the board.
- 🌡️ Current temperature, "feels like", condition, humidity, and wind.
- 🗓️ Upcoming-day forecast on each card.
- 🎚️ °C / °F temperature toggle.
- ⏳ Loading states and friendly error messages (e.g. city not found).
- 📱 Fully responsive — works on desktop, tablet, and mobile.
- 🔓 **No API key needed.**

## 🛠️ Tech stack

- **React 18** (components, props, state, events, conditional rendering)
- **Vite** (fast dev server + build tooling)
- **CSS3** — variables, Flexbox, Grid, responsive media queries
- **[Open-Meteo](https://open-meteo.com)** — live weather & forecast (free, no key)
- **[OpenStreetMap Nominatim](https://openstreetmap.org)** — city name → coordinates (free, no key)

## 🚀 Getting started

You need **Node.js 18+** installed.

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server (no API key or .env setup required)
npm run dev
```

Open the printed URL (default: https://vickytttt.github.io/front/weather-db/).

### Build for production

```bash
npm run build      # creates ../weather-db
npm run preview    # preview the built site locally
```

## 📁 Project structure

```
project 4/
├─ index.html
├─ vite.config.js
├─ package.json
├─ README.md
└─ src/
   ├─ main.jsx             # React entry point
   ├─ App.jsx              # layout + state (loading / error / data)
   ├─ App.css              # styles
   ├─ index.css            # global styles + theme variables
   ├─ api/
   │  └─ openMeteo.js      # live weather + geocoding (no key)
   └─ components/
      ├─ LocationCard.jsx  # one location's live weather
      ├─ Forecast.jsx      # compact daily forecast strip
      └─ WeatherIcon.jsx   # reusable weather icon
```

## ✅ How it meets the requirements

- **Complete frontend** — search-like navigation, multiple sections, consistent UI.
- **HTML/CSS** — HTML5 + CSS3, responsive Grid/Flexbox layouts.
- **React concepts** — reusable Components, Props, State (`useState`/`useEffect`),
  Events (`onSubmit`), Conditional rendering (loading / error / result).
- **Live & interactive** — real weather fetched at runtime, plus a °C/°F toggle.
- **Responsive** — desktop, tablet, and mobile breakpoints.
