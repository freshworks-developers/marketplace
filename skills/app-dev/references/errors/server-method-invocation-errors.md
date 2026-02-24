>title: Fixing function invalid name error
>tags: serverless-offerings, smi
>context: server.js, manifest.json, app.js
>content:

# Fixing function invalid name error

## FDK validation failed with the error 
```
Function "<name>" for <productModuleNamespace> "<product>" has invalid name
```

## Steps to resolve the validation errors
1. SMI functions are declared in `products.[productname].functions` in `manifest.json`.
2. Ensure the name follows the 2-40 characters with alphanumeric and underscore.

---

>title: Fixing function name is not defined for product
>tags: serverless-offerings, smi
>context: server.js, manifest.json, app.js
>content:

# Fixing function name is not defined for product

## FDK validation failed with the error 
```
Function <name> is not defined for <productModuleNamespace> <product>
```

## Steps to resolve the validation errors
1. SMI functions are declared in `products.[productname].functions` in `manifest.json`.
2. The name of SMI should be consistent in `manifest.json`, `server.js` and while invoking in `app.js`.
---