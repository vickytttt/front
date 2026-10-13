import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The site is hosted at https://vickytttt.github.io/front/weather-db/,
// so asset references must include the repo + folder path.
export default defineConfig({
  base: '/front/weather-db/',
  build: {
    // Emit the built files into the sibling weather-db/ folder, which is
    // exactly where GitHub Pages serves from. Source stays here in "project 4/".
    outDir: '../weather-db',
  },
  plugins: [react()],
})
