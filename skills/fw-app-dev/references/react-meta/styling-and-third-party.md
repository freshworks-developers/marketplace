# Styling and third-party libraries

React Meta apps **must** use **`@freshworks/dew-components`** and **`@freshworks/dew-styles`** as the primary UI stack. DEW remains the base when adding Tailwind, MUI, or other libs.

## Tailwind CSS

Reference: [Superstack](https://github.com/freshworks-developers/superstack) (Tailwind + MUI + Redux demo).

```bash
npm install -D tailwindcss postcss autoprefixer
```

Add `tailwind.config.js`, `postcss.config.js`, and optional `vite.config.js` PostCSS hook. See `vite-config.md`.

Route example (official doc sample):

```jsx
<Route path="/app/tailwind" element={<TailwindPage />} />
```

**Layering:** Import DEW styles first; apply Tailwind utilities on wrappers. Avoid conflicting global resets on DEW components.

## State and routing

- Redux Toolkit — Superstack pattern for multi-page demos
- React Router — required; see `react-meta-fdk-standards.md`
- Context API — fine for small apps

## Other UI libraries

MUI, Emotion, etc. are **allowed** when the user requests them. DEW remains recommended for Freshworks-native surfaces.

## Do not remove during validate

Agents must **not** strip Tailwind, MUI, Redux, or other third-party deps during autofix unless they violate Platform 3.0 rules.
