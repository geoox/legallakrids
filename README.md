# Legal Lakrids

React and Vite website for Legal Lakrids events and legal commentary.

## Development

```bash
npm ci
npm run dev
```

Before committing changes:

```bash
npm run lint
npm run build
```

## Project structure

```text
src/
├── assets/                 Images and video bundled by Vite
├── components/
│   ├── layout/             Site-wide header and footer
│   ├── sections/           Homepage sections
│   └── ui/                 Reusable presentational components
├── data/                   Static article and event records
├── hooks/                  Reusable state and navigation behavior
├── pages/                  Interior page views
├── utils/                  Framework-independent helpers
├── App.jsx                 Application composition root
├── index.css               Global styles and design tokens
└── main.jsx                React entry point
```

Keep content records in `src/data`, rendering in components or pages, and browser
navigation behavior in `src/hooks/useSiteNavigation.js`. `App.jsx` should remain a
small composition layer.

## Deployment

The production site is served from the `gh-pages` branch at
[legallakrids.com](https://legallakrids.com). Use the
`legal-lakrids-pages-deploy` repository skill or run:

```bash
npm run deploy
```

The command builds `dist` and publishes it through the existing `gh-pages` package.
