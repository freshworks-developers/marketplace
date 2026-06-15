# Vitest mocks for `window.client`

Use when unit-testing frontend utils that call `client.request.invokeTemplate`, `client.data.get`, or `client.db` — without running `fdk run`.

## When to use

- Pure functions accept `client` as first argument (preferred — no global mock needed).
- Testing `invokeTemplate` context builders, response parsers, filters.
- CI `fdk-unit-test` script runs `vitest run --coverage`.

## Steps

1. **Structure utils** — `fetchCustomers(client, options)` not `fetchCustomers(options)` reading globals.
2. **Create mock client** per describe block with `vi.fn()` stubs.
3. **Reset between tests** — `beforeEach(() => vi.clearAllMocks())`.
4. **Assert call shape** — template name + `{ context }` / `{ options }`.
5. **Return realistic payloads** — `{ response: '{"customers":[]}' }` matches platform shape.

## Mock client template

```js
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { fetchCustomers, parseTemplateResponse } from '../app/utils/shopify-api.js';

describe('shopify-api.js', () => {
  const mockClient = {
    request: {
      invokeTemplate: vi.fn(),
      invoke: vi.fn()
    },
    data: {
      get: vi.fn()
    },
    db: {
      get: vi.fn(),
      set: vi.fn()
    },
    iparams: {
      get: vi.fn().mockResolvedValue({})
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('parseTemplateResponse parses JSON string', () => {
    expect(parseTemplateResponse({ response: '{"customers":[]}' }))
      .toEqual({ customers: [] });
  });

  test('fetchCustomers passes pagination context', async () => {
    mockClient.request.invokeTemplate.mockResolvedValue({
      response: '{"customers":[{"id":1}]}'
    });

    const data = await fetchCustomers(mockClient, { limit: 50, sinceId: 10 });

    expect(mockClient.request.invokeTemplate).toHaveBeenCalledWith('fetchCustomers', {
      context: { limit: '50', since_id: '10' }
    });
    expect(data.customers).toHaveLength(1);
  });
});
```

## Mock SMI invoke

```js
mockClient.request.invoke.mockResolvedValue({
  response: JSON.stringify({ freshdeskDomain: 'acme.freshdesk.com' })
});

const res = await mockClient.request.invoke('getInstallConfig', {});
expect(JSON.parse(res.response).freshdeskDomain).toBe('acme.freshdesk.com');
```

## Mock client.data.get

```js
mockClient.data.get.mockImplementation((entity) => {
  if (entity === 'ticket') return Promise.resolve({ ticket: { id: 42, subject: 'Test' } });
  if (entity === 'contact') return Promise.resolve({ contact: { email: 'a@b.com' } });
  return Promise.reject(new Error('unknown entity'));
});
```

## Mock client.db

```js
const store = {};
mockClient.db.get.mockImplementation(key => Promise.resolve(store[key] ?? null));
mockClient.db.set.mockImplementation((key, val) => { store[key] = val; return Promise.resolve(); });
```

## vitest.config.js essentials

```js
export default {
  test: { environment: 'jsdom', globals: true },
  coverage: { include: ['app/**/*.js', 'app/**/*.jsx'] }
};
```

## Pitfalls

| Symptom | Fix |
|---------|-----|
| Tests hit real FDK | Never call `window.app.initialized()` in unit tests |
| Global `window.client` pollution | Pass `mockClient` into functions under test |
| False green — wrong template name | Assert first arg of `invokeTemplate` explicitly |
| Async flake | `await` the function; use `mockResolvedValue` not sync returns |
| Parser tests coupled to network | Test `parseTemplateResponse` separately from fetch fns |
| Missing `vi.clearAllMocks` | Reset in `beforeEach` to avoid call count bleed |
