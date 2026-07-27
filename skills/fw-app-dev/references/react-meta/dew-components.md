# DEW components (React Meta — required UI)

React Meta apps **must** use UI from **`@freshworks/dew-components`** and design tokens from **`@freshworks/dew-styles`** (DEW 3.0). Do not use Crayons, plain HTML controls, or ad-hoc UI libraries as the primary component set.

| Package | Purpose |
|---------|---------|
| `@freshworks/dew-components` | DEW 3.0 React components |
| `@freshworks/dew-styles` | Colors, typography, spacing tokens |

**Component catalog:** [dew.freshworkscorp.com/dew-3.0/](https://dew.freshworkscorp.com/dew-3.0/) (Storybook)

## Installation

```bash
npm install @freshworks/dew-components @freshworks/dew-styles
```

## Required imports

**Components** — import only from `@freshworks/dew-components`:

```jsx
import { DewTheme, TextButton, InputField, Badge } from '@freshworks/dew-components';
```

**Styles** — import token stylesheets from `@freshworks/dew-styles`:

```jsx
import '@freshworks/dew-styles/dist/colors.css';
import '@freshworks/dew-styles/dist/fonts.css';
import '@freshworks/dew-styles/dist/numbers.css';
```

Wrap the app root with `<DewTheme>` when using DEW components.

Browse available exports and usage in Storybook before adding custom UI.

## Registry (GitHub Packages)

If `npm install` fails on the public registry, configure GitHub Packages:

```
@freshworks:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

## Forbidden in Meta workflow

- `@freshworks/crayons`, Crayons CDN, `<fw-*>` web components
- Plain `<button>`, `<input>`, `<select>` as primary UI (use DEW components)
- Third-party UI libs **replacing** DEW as the base (Tailwind/MUI may supplement — see `styling-and-third-party.md`)
