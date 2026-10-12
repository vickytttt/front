# Alex Morgan — Portfolio

A simple, responsive React portfolio website (a single-page CV built with **React** and **Vite**).

## Features

- Single-page layout with a sticky navigation bar and smooth-scroll anchors (Home, About, Skills, Projects, Education, Contact)
- Built with **React 19** components and semantic HTML
- Responsive design that adapts to desktop and mobile
- Clean, professional color and typography scheme
- Data-driven content: all portfolio content is defined in a single data object

## Project Structure

All source lives in `source/` at the repo root. Running the build writes the
production files straight into the sibling `cv-website/` folder (the folder
GitHub Pages serves from), so the source is never overwritten.

```
front/
├── cv/                    <- plain static page (unchanged)
├── bakery/                <- plain static page (unchanged)
├── source/                <- all app source (edit here)
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── assets/
│   ├── package.json
│   └── .gitignore         <- ignores node_modules
└── cv-website/             <- build output (commit this, served by Pages)
    ├── index.html
    ├── favicon.svg
    └── assets/
```

## How to Run / Deploy

```bash
cd source
npm install
npm run dev       # start the dev server
npm run build     # writes output into ../cv-website/
npm run lint      # run the linter
```

Then commit and push the whole repo. Open:
https://vickytttt.github.io/front/cv-website/

## Technologies

- React 19
- Vite
- JavaScript (ESM)
- oxlint
