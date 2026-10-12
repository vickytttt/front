import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // The site is hosted at https://vickytttt.github.io/front/cv-website/,
  // so asset references must include the repo + folder path.
  base: '/front/cv-website/',
  build: {
    // Emit the built files into the sibling cv-website/ folder, which is
    // exactly where GitHub Pages serves from. Source stays here in source/.
    outDir: '../cv-website',
  },
  plugins: [react()],
})
