# Vaishnavi Kumari — Portfolio

A personal portfolio site themed as a "developer passport" — profile, skills, and
projects framed as passport pages, with achievements rendered as ink-stamp badges.

Built with hand-written HTML, CSS, and JavaScript. Vite provides the dev server,
bundling, minification, and hashed production assets; no UI framework is used.

## View it

Use Node.js 24 (the CI version), then install the locked dependencies and start Vite:

```
npm ci
npm run dev
```

Open the local URL printed by Vite, under `/vaishnavi-portfolio/`.
The published site is:
`https://vaishnokri.github.io/vaishnavi-portfolio/`

## Production build and mobile regression checks

```sh
npm run build
npm run preview
```

`dist/` contains the production site. `vite.config.js` sets
`base: '/vaishnavi-portfolio/'` because GitHub Pages hosts this repository at a
subpath. Keep this setting when deploying to the current Pages URL. CSS, scripts,
and the three self-hosted WOFF2 fonts receive content hashes.

```sh
npx playwright install chromium
npm run test:e2e
```

Build before running the tests. Playwright starts a strict static server for
`dist/` at port 4173; it does not silently serve assets at the domain root or
substitute HTML for missing files. Tests cover 320, 375, 390, and 430px portrait
widths (780px height), plus 780x390 landscape, in light and dark themes. They check
44px touch targets, a 14px minimum for meaningful text, overflow, stamp collisions,
hashed Pages asset URLs, local fonts, keyboard navigation, and theme persistence.

Full-page production screenshots must match the unbundled source in the same
browser. This checks build fidelity without platform-dependent screenshot
baselines; authored visual changes are allowed, while geometry requirements
remain enforced. Both images are attached to the HTML Playwright report.

CI builds and runs these checks on every push and pull request. Only a successful
`main` build can deploy, and Pages receives the tested `dist/` artifact rather
than the repository root. Test reports are retained as Actions artifacts for
14 days. Browser emulation does not replace physical-device testing.

## Structure

- `index.html` — page structure and content
- `style.css` — design system (color/type tokens, layout, the stamp component)
- `script.js` — active-nav highlighting and scroll-reveal
- `assets/` — icons/images
- `vite.config.js` — build configuration and Pages base path
- `tests/` and `playwright.config.js` — mobile and build-fidelity regression checks

## Customize

The bio, skills, and project entries in `index.html` are starter placeholders —
swap in real project links, real achievements, and real contact details before
sharing this publicly.
