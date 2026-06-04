# Handler patterns (async / unused params)

## Async without await (invalid)

```javascript
// [INVALID] async without await → lint error
exports = { onAppInstallHandler: async function(args) { console.log('ok'); } };
```

## Valid handlers

```javascript
// [VALID] sync handler OR async only when body contains await
exports = { onAppInstallHandler: function(args) { console.log(args.iparams.domain); } };
```

## Unused parameters (blocking)

```javascript
// [INVALID] unused args (and _args) → remove parameter entirely
onAppInstallHandler: function(args) { console.log('Installed'); }

// [VALID]
onAppInstallHandler: function() { console.log('Installed'); }
onAppInstallHandler: function(args) { console.log(args.iparams.domain); }
```

**Lint:** `'args' is defined but never used` — apps with unused parameters cannot pass `fdk validate`.
