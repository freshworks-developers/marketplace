# vite.config.js (optional)

**FDK 10.1.5+** supports an optional `vite.config.js` at the **project root**.

## Merge behavior

1. FDK **deep-merges** your config with its internal Vite config.
2. On conflict, **FDK wins** for:
   - Entry points
   - `app` / `config` resolve aliases
   - FDK-required plugins

## Safe extensions

- Extra path aliases (non-conflicting)
- `css.postcss` for Tailwind
- `define`, `server.proxy`, `manualChunks`
- Additional Vite plugins (SVG, etc.)

## Example (safe)

```js
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/app/components',
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
});
```

## Do not override

Do **not** replace FDK entry blocks or `app`/`config` alias keys. If validate fails due to custom Vite config, remove conflicting keys only — keep safe extensions.

See also: `assets/templates/react-meta-frontend-skeleton/vite.config.js` (commented stub).
