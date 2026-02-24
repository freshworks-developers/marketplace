>title: what is currentHost method in Freshworks apps
>tags: data method, currentHost
>context: manifest.json
>content:

# what is currentHost method in Freshworks apps

`currentHost` refers to the specific Freshworks product on which your global, module-specific app is currently running. It essentially identifies the hosting environment for your app.

## Benefits of currentHost

1. Determines user subscriptions
2. Enables module-specific logic
3. Facilitates API calls

### Determines user subscriptions

Based on `currentHost`, the backend retrieves the modules the app user on that host has subscribed to.

### Enables module-specific logic

With knowledge of subscribed modules, your app can execute logic tailored to specific modules.

### Facilitates API calls

Using currentHost, your app retrieves product-specific URLs to access the hosting product's resources through API calls.

---
>title: How do I retrieve information about currentHost
>tags: data method, currentHost
>context: manifest.json
>content:

# How do I retrieve information about currentHost

## Methods to retrieve information

1. For Front-end apps
2. For Serverless apps

### For Front-end apps

Use the currentHost data method to retrieve details.

### For Serverless apps

This information is included in the serverless event payload sent to your app.

---
>title: what information does currentHost method provide
>tags: data method, currentHost
>context: manifest.json
>content:

# what information does currentHost method provide

## Key properties of currentHost object

1. `subscribed_modules`
2. `endpoint_urls`

### subscribed_modules

An array of strings listing all modules the app user subscribing to the current product has access to, as specified in your app's manifest.

### endpoint_urls

An object mapping product names to their corresponding account URLs. This allows your app to construct API calls targeting specific products.

---
>title: How do I use currentHost data in my app
>tags: data method, currentHost
>context: manifest.json, iparams.json, iparams.js
>content:

# How do I use currentHost data in my app

## Usage scenarios

1. For Templated request construction
2. For Module-specific settings

### For Templated request construction

During request template creation, use the currentHost template substitution to include relevant URLs.

### For Module-specific settings

  - In iparams.json: Use the modules attribute to tie installation parameters to specific modules.
  - Unspecified parameters: Appear on the app settings page for any subscription.
  - Module-specific parameters: Appear only if the user subscribes to that module.
  - In iparams.html: Fetch subscribed modules using currentHost and conditionally render module-specific parameters.
  - In iparams.js: Implement module-specific logic.

## Example: Retrieve currentHost information

### JavaScript Snippet

To get information of currentHost via data methods use the following snippet:

```js
async function getCurrentHostData() {
  try {
    const data = await client.data.get("currentHost");
    // success operation
    // "data" is {subscribed_modules: ["contact", "deal", ... ]}
  } catch (error) {
    // failure operation
  }
}

getCurrentHostData();
```

### Data Payload Example

The data payload could be as following:

```json
{
  "subscribed_modules": [
    "appoinment",
    "deal",
    "lead",
    "product",
    "cpq_document",
    "contact",
    "sales_account",
    "phone",
    "task"
  ],
  "endpoint_urls": {
    "freshsales": "https://subdomain.freshsales.io",
    "freshworks_crm": "https://subdomain.myfreshworks.com"
  }
}
```

---
