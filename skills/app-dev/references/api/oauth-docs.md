>title: What are the deprecated OAuth features from platform version 2.2
>tags: oauth, request-method
>context: oauth_configs.json, manifest.json, request.json
>content:

# What are the deprecated OAuth features from platform version 2.2
OAuth usage for request method now requires it to be defined in `configs/requests.json` instead of using the `isOAuth` options while using request method in `app.js` or `server.js`. 