# Pattern: Utils extraction + Vitest mocks

## When to use

- Vanilla `app.js` mixes DOM, API calls, and formatting — hard to test.
- MG-1: `app/utils/api-client.js` + `validation.js`
- MG-2: `app/utils/sheets.js`
- MG-3: `app/utils/external-api.js`
- MG-4: `app/utils/timer.js`

## Steps

1. **Identify pure functions** — parsers, formatters, payload builders, state normalizers.
2. **Extract to `app/utils/<domain>.js`** — no DOM, no React imports.
3. **Keep I/O at the edge** — utils accept `client` or raw API responses; components call `client.request.invokeTemplate`.
4. **Add `vitest.config.js`**:

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['app/utils/**/*.js'],
      reportsDirectory: 'coverage/unit',
      reporter: ['json', 'text']
    }
  }
});
```

5. **Add `tests/<domain>.test.js`** — test utils in isolation.
6. **Wire manifest** — `"scripts": { "fdk-unit-test": "vitest run --coverage" }`.

## Extraction map (from migrations)

| Legacy location | Extracted module | Test file |
|-----------------|------------------|-----------|
| Inline API fetch helpers | `app/utils/api-client.js` | `tests/api-client.test.js` |
| Sheet row/status mappers | `app/utils/sheets.js` | `tests/sheets.test.js` |
| External record payload builders | `app/utils/external-api.js` | `tests/external-api.test.js` |
| Timer math / persistence shape | `app/utils/timer.js` | `tests/timer.test.js` |

## Mock pattern for API utils

```js
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { fetchAllOrders, parseTemplateResponse } from '../app/utils/api-client.js';

describe('api-client.js', () => {
  const mockClient = {
    request: { invokeTemplate: vi.fn() },
    data: { get: vi.fn() }
  };

  beforeEach(() => vi.clearAllMocks());

  test('parseTemplateResponse parses JSON', () => {
    expect(parseTemplateResponse({ response: '{"orders":[]}' }))
      .toEqual({ orders: [] });
  });

  test('fetchAllOrders calls invokeTemplate', async () => {
    mockClient.request.invokeTemplate.mockResolvedValue({
      response: '{"orders":[{"id":1}]}'
    });
    const orders = await fetchAllOrders(mockClient, 'token');
    expect(mockClient.request.invokeTemplate).toHaveBeenCalledWith(
      'fetchOrders', expect.any(Object)
    );
    expect(orders).toHaveLength(1);
  });
});
```

## Pure-function tests (no mocks)

```js
import { formatTime, normalizeState } from '../app/utils/timer.js';

test('formatTime formats mm:ss', () => {
  expect(formatTime(125000)).toBe('02:05');
});
```

## Pitfalls

- Testing mock return values only — assert real transformation logic.
- Importing React in utils — keeps modules untestable in Node.
- Coverage on components before utils — prioritize `app/utils/**` first.
- Forgetting `.babelrc` — FDK expects it for JSX; utils are plain JS.
- Leaving `window.client` global in utils — pass `client` as parameter.

## Agent checklist

```
[ ] Pure helpers in app/utils/
[ ] Components import utils, own JSX/state only
[ ] vitest.config.js with utils coverage include
[ ] tests/ mirror utils modules
[ ] fdk-unit-test script in manifest.json
[ ] npm run fdk-unit-test passes before claiming done
```
