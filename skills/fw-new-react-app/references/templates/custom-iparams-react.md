# Custom React iparams page

Use when declarative `config/iparams.json` is not enough — dynamic dropdowns, cross-field validation, live API previews, or multi-product credential forms.

## When to use

- Dropdown values loaded from external API at install time (Asana workspaces).
- Complex validation (require domain **and** API key pairs).
- Branded install UI with Crayons React components.
- Admin must test connection before saving.

## Steps

1. **config/iparams.html** — platform shell + `#root` + module entry.
2. **React entry** — init `window.app.initialized()`; render form component.
3. **Expose globals** — assign `window.getConfigs`, `window.postConfigs`, `window.validate` (required contract).
4. **getConfigs** — hydrate form state when admin re-opens install settings.
5. **postConfigs** — return plain object matching iparam field names (trim strings).
6. **validate** — return `true` or `false`; show inline errors before platform saves.
7. **Optional hooks** — `window.getAsanaWorkspaces` etc. wired from iparams.json `"events"`.

## iparams.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="{{{appclient}}}"></script>
  <title>Installation Parameters</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./assets/components/main.jsx"></script>
</body>
```

## Bootstrap (main.jsx)

```jsx
window.app.initialized().then((client) => {
  window.client = client;
  setChild(<Iparam />);
});
```

## Required window contract

```jsx
function Iparam() {
  const [iparamData, setIparamData] = useState({
    freshdeskDomain: '',
    freshdeskApi: ''
  });

  // Called by platform with saved values (edit install / reinstall)
  const getConfigs = (configs = {}) => {
    setIparamData({
      freshdeskDomain: configs.freshdeskDomain || '',
      freshdeskApi: configs.freshdeskApi || ''
    });
  };

  // Called on save — keys must match iparams.json field names
  const postConfigs = () => ({
    freshdeskDomain: iparamData.freshdeskDomain.trim(),
    freshdeskApi: iparamData.freshdeskApi.trim()
  });

  // Called before save — return false to block install
  const validate = () => {
    const ok = iparamData.freshdeskDomain.trim() && iparamData.freshdeskApi.trim();
    if (!ok) showInstallError('Enter domain and API key');
    return !!ok;
  };

  window.getConfigs = getConfigs;
  window.postConfigs = postConfigs;
  window.validate = validate;

  return (/* Crayons form */);
}
```

## Vanilla alternative

Use `config/assets/iparams.js` when dropdowns cascade via `utils.set` / `utils.get` — still expose `window.validate`. React custom page is better for multi-section Crayons forms (`config/assets/components/Iparam.jsx`).

## Pitfalls

| Symptom | Fix |
|---------|-----|
| Install saves empty values | `postConfigs` keys must match `iparams.json` keys exactly |
| Edit install doesn't hydrate | Implement `getConfigs`; platform passes saved object |
| Save proceeds with bad data | `validate` must return `false` (not throw) |
| Secure fields in postConfigs | Only non-secure fields from React; secrets use iparams.json `"secure": true` |
| API calls fail on iparams page | Init client first; use `invoke`/`invokeTemplate` after `app.initialized()` |
| Globals overwritten on re-render | Assign `window.getConfigs` once (component body is OK if idempotent) |
