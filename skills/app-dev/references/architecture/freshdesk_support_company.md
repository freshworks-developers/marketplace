>title: what is support company module in Freshdesk
>tags: module=support_company, support_company, freshdesk
>context: 
>content:

# What is support company module in Freshdesk

An app user with a stand-alone Freshdesk subscription or a subscription to any SKU that has Freshdesk as one of the products can use this module. Using this module you can build a front end app, a serverless app and also a full stack SMI app for Freshdesk Company feature.

---

>title: what are the placeholders supported for support company module in Freshdesk
>tags: module=support_company, support_company, freshdesk
>context: manifest.json
>content:

# What are the placeholders supported for support company module in Freshdesk

## Common placeholders

It supports following Common placeholders. In the app manifest, configure these placeholders at `modules.common`.
1. Full Page App as `full_page_app`
2. CTI Global sidebar as `cti_global_sidebar`

## Module-specific placeholders

It supports following Module-specific placeholders. In the app manifest, configure these placeholders at `modules.support_company`.
1. `company_background`
2. `company_list_background`

---

>title: how to use placeholders supported for support company module in Freshdesk
>tags: module=support_company, support_company, freshdesk
>context: manifest.json
>content:

# How to use placeholders supported for support company module in Freshdesk

To use the Support ticket placeholder modify your `manifest.json` as below 

```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "location": {
        "full_page_app": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        },
        "cti_global_sidebar": {
          "url": "cti_global_sidebar.html",
          "icon": "styles/images/icon.svg"
        }
      },
      "requests": {}
    },
    "support_company": {
      "location": {
        "company_background": {
          "url": "company_background.html"
        },
        "company_list_background": {
          "url": "company_list_background.html"
        }
      }
    }
  }
}
```

---
>title: How to Write an App for Background Placeholders for support_company module for Freshdesk
>tags: module=support_company, support_company, freshdesk
>context: manifest.json
>content:

# How to Write an App for Background Placeholders for support_company module

## What Are Background Placeholders

Background placeholders are entry points in the Freshworks Developer Platform where your app’s logic runs without rendering any UI to the agent. Unlike sidebar or modal placeholders that load HTML/CSS, background placeholders load an invisible page (e.g., `background.html`) and execute JavaScript in the background context.


## In **Platform 3.0**, the **support_company** module supports these background placeholders:

- `company_background`: The app runs in the background of the company details page of Freshdesk.
- `company_list_background`: The app runs in the background of the company list page of Freshdesk.

These placeholders let you react to page loads and data changes, perform automated tasks, and integrate external services without cluttering the UI.

## What Is It Used For

Background placeholders are ideal for:

- **Data synchronization**: Fetching or updating external systems when a ticket or its timeline changes.
- **Automated workflows**: Triggering scheduled or event-driven processes (e.g., setting default values, auto-tagging, enrichment).
- **Event interception**: Listening for field changes (status, tags) and reacting before or after the native UI updates.
- **Analytics & logging**: Recording user or ticket activity without requiring a visible interface.
- **Notifications**: Sending alerts (email, Slack) when certain ticket conditions are met, even if the agent doesn’t click anything.
- **Data Manipulation**: Hiding a ticket field when certain validation criteria is met.

Because these run in the background, they have minimal impact on page performance and keep the UI clean for the agent.

## How to Use background placeholders

### Step 1. Declare in the Manifest

In your `manifest.json`, under the `support_company` module, add the background placeholders to the `location` block. For example:

```json
"support_company": {
  "events": {
    "onTicketUpdate": {
      "handler": "onTicketUpdateCallback"
    }
  },
  "location": {
    "ticket_background": {
    "url": "background.html"
    }
  }
}
```

### Step 2. Create the Background HTML

Even though it’s not visible, each placeholder URL needs a corresponding HTML file. Typically, `background.html` looks like:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="{{{appclient}}}"></script>
    <title>Background</title>
  </head>
  <body>
    <main>
      <section>This app runs in back ground. Hence no UI</section>
    </main>
  </body>
  <script src="/app.js />
</html>
```

### Step 3. Additionally, you can implement your background logic

Declare requests, functions in app.js and add iparams or request templates as needed.

```js
//app.js
var client;
client = await app.initialized();
client.events.on('app.activated', () => {
  console.log(`company_background:  app is activated`);
});
```

---

>title: data methods supported for support company module in Freshdesk
>tags: module=support_company, support_company, freshdesk, data_method
>context: 
>content:

# Data methods supported for support company module in Freshdesk

You can use the `client.data.get()` data method to retrieve the following objects. Objects accessible regardless of the placeholders
1. `currentHost`
2. `loggedInUser`

---

>title: example of data method usage supported for support company module in Freshdesk
>tags: module=support_company, support_company, freshdesk
>context: 
>content:

# Example of data method usage supported for support company module in Freshdesk

## To retrieve current host information

```js
async function getCurrentHostData() {
  try {
    const data = await client.data.get("currentHost");
    // success operation
    // "data" is {subscribed_modules: [“contact”, “deal”, ... ]}
  } catch (error) {
    // failure operation
  }
}

getCurrentHostData();
```

## For loggedInUser information

```js
async function getLoggedInUserData() {
  try {
    const data = await client.data.get("loggedInUser");
    // success operation
    // "data" is {loggedInUser: {‘available’: “true”, ... }}
  } catch (error) {
    // failure operation
  }
}

getLoggedInUserData();
```

---

>title: what are events methods supported for support company module in Freshdesk
>tags: module=support_company, support_company, freshdesk, events_method
>context: 
>content:

# What are events methods supported for support company module in Freshdesk

Common event: An app deployed at cti_global_sidebar can react to the `cti.triggerDialer` event. It gets triggered when user clicks on
1. Ticket details page > CONTACT DETAILS widget
2. Ticket list page > Contact hover card
3. New ticket page > CONTACT DETAILS widget
4. Contact list page > Contact hover card
5. Contact details page > Contact header and DETAILS widget

---

>title: how to use events methods supported for support company module in Freshdesk
>tags: module=support_company, support_company, freshdesk, events_method
>context: 
>content:

# How to use events methods supported for support company module in Freshdesk

## To use `cti.triggerDialer`

```js
{
  //Configure event listener and subscribe to event
  //Register callback
  client.events.on("cti.triggerDialer", eventCallback);
  var eventCallback = function (event) {
  //Retrieve event data
  var data = event.helper.getData();
  // App logic
  };
}
```

---

>title: what are interface methods supported for support company module in Freshdesk
>tags: module=support_company, support_company, freshdesk, interface_methods
>context: 
>content:

# What are interface methods supported for support company module in Freshdesk

## Interface actions regardless of the placeholders

1. Display modals or dialog boxes - `showModal` method and `showDialog` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`
4. Display or hide CTI dialler
5. Display or hide missed calls in the CTI widget
6. `click` method on Open Ticket or Company details page

## Placeholder-specific interface actions

1. Hide/display or enable/disable UI elements on the Company details page > DETAILS widget (and Edit company window) via `client.interface.trigger("<method-name>", {id: "<element-name>"})` where `<method-name>` can be `hide`, `show`, `enable`, `disable`.
2. Hide/display or enable/disable UI elements On the Company list page > Edit company window for All Edit company window fields via `client.interface.trigger("<method-name>", {id: "<element-name>"})`

---

>title: how to use interface methods supported for support company module in Freshdesk
>tags: module=support_company, support_company, freshdesk, interface_methods
>context: 
>content:

# How to use interface methods supported for support company module in Freshdesk

## To show modal or dialog

```js
try {
let data = client.interface.trigger('showDialog', {
title: 'Sample Dialog',
template: 'dialog.html' });
console.log(data); // success message
} catch (error) {
    // failure operation
console.error(error);
}
```

## To display notifications

```js
client.interface.trigger("showNotify", {
    type: “<Possible values: info, success, warning, danger, alert>”,
    title: "<Display name>",
    message: "<text message to be displayed in the notification box>"
    }
)
```

## To show an element

Possible values of <element-name>: `description`, `note`, `domains`, `health_score`, `account_tier`, `renewal_date`, `industry`, `element_name` etc.

```js
client.interface.trigger("show", {id: "<element-name>"})
.then(function(data) {
  // data - success message
}).catch(function(error) {
  // error - error object
});
```

---

>title: what are instance methods supported for support company module in Freshdesk
>tags: module=support_company, support_company, freshdesk, instance_methods
>context: 
>content:

# What are instance methods supported for support company module in Freshdesk

Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to
1. Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
2. Send data from a modal to a parent placeholder and get the data in the parent.
3. Send data from one instance to another instance and receive data at the destination.

---

>title: how to use instance methods supported for support company module in Freshdesk
>tags: module=support_company, support_company, freshdesk, instance_methods
>context: 
>content:

# How to use instance methods supported for support company module in Freshdesk

1. To Send data from a parent placeholder to a modal and retrieve the context/data in the modal.

  - In parent UI

```js
try {
 await client.interface.trigger("showModal", {
 title: "Information Form",
 template: "modal.html",
 data: {
     name: "James",
     email: "James@freshworks.com"
 }
 });
 } catch (error) {
 console.error(error);
 }
```

  - In modal UI

```js
 try {
 let context = await client.instance.context();
 console.log("Modal instance method context", context);
 /* Output: Modal instance method context
 {
 instanceId: "4",
 location: "modal",
 parentId: "1",
 modalData: {name: "James", email: "James@freshworks.com"} }"
 */
 } catch (error) {
 console.error(error);
 }
```

2. To Send data from a modal to a parent placeholder and get the data in the parent.

 - In parent UI

```js
 client.instance.receive(
 function(event) {
     let data = event.helper.getData();
     console.log(data);
     /* Output:
     {
     senderId: "4",
     message: {
     name: "James",
     email: "james.dean@freshworks.com"
     }
     }*/
 }
 );
```

  - In modal UI

```js
 client.instance.send({
 message: {
     name: "James",
     email: "james.dean@freshworks.com"
 }
 });
 /* message can be a string, object, or array */
```

3. To Send data from one instance to another instance and receive data at the destination

 - In placeholder 1

```js
 client.instance.get().then(
 function(data) {
 console.log(data);
     /* output: [
     {
         instanceId: "1",
         location: "place_holder1"},
     {
         instanceId: "2",
         location: "place_holder2"}
     ]; */
 var pl2App = data.find(x => x.location === "place_holder2");
 client.instance.send({
     message: {
     name: "James",
     email: "james.dean@freshworks.com"
     },
     receiver: pl2App.instanceId
 });
     /* 2 - instance ID of the receiver */
 }
 );
```

  - In placeholder 2

```js
 client.instance.receive(
 function(event) {
     let data = event.helper.getData();
     console.log(data);
     /* Output:
     {
         senderId: "1",
         message: {
         name: "James",
         email: "james.dean@freshworks.com"
         }
     }
     */
 }
 );
```

---

>title: what are the serverless events supported by support company module of Freshdesk
>tags: module=support_company, support_company, freshdesk, serverless_events
>context: manifest.json
>content:

# What are the serverless events supported by support company module of Freshdesk

An app built for this module can react to the following events.

## Common events

In the app manifest, configure these events at `modules.common`.
1. App set-up events
   1. `onAppInstall`
   2. `afterAppUpdate`
   3. `onAppUninstall`
2. External events
   1. `onAppInstall`
   2. `onExternalEvent`
   3. `onAppUninstall`
3. Scheduled events

## Product-specific events

In the app manifest, configure these events at `modules.support_company`.
1. `onContaconCompanyCreate`
2. `onCompanyUpdate`
3. `onCompanyDeletetCreate`

---

>title: how to configure product events supported by support company module of Freshdesk
>tags: module=support_company, support_company, freshdesk, product_events
>context: manifest.json, server.js
>content:

# How to configure product events supported by support company module of Freshdesk

## Subscribe to an event by configuring an event listener in `manifest.json`

```json
{
"events": {
  "<productEventName>": {
      "handler": "<eventCallbackMethod>"
    }
  }
}
```

## In `server.js` file under the exports block

Enter the callback function definition as follows:

```js
 exports = {
 // args is a JSON block containing the payload information
 // args["iparam"] will contain the installation parameter values
 //eventCallbackMethod is the call-back function name specified in manifest.json
 eventCallbackMethod: function(args) {
   console.log("Logging arguments from the event: " + JSON.stringify(payload));
 }};
```

## Use the appropriate payload attribute for callback with below syntax

```json
{
  "currentHost": {
    "subscribed_modules": [ "support_company" ],
    "endpoint_urls": {
      "freshdesk": "value"
    }
  },
  "data" : {
    //Contains the list of objects related to the event.
  },
  "event"  : "value",
  "iparams" : {
      "Param1" : "value",
      "Param2" : "value"
  },
  "region"  : "value",
  "timestamp"  : "value",
}
```

---

>title: how to configure ticket events supported by support company module of Freshdesk
>tags: module=support_company, support_company, freshdesk, product_events, ticket_events
>context: manifest.json, server.js
>content:

# How to configure ticket events supported by support company module of Freshdesk

## Subscribe to ticket event by configuring an event listener in `manifest.json`

```json
{
  "events": {
    "onCompanyCreate": {
      "handler": "onCompanyCreateCallback"
    }
  }
}
```

## In `server.js` file under the exports block

Enter the callback function definition as follows:

```js
exports = {
  onCompanyCreateCallback: function(payload) {
    console.log("Logging arguments from onCompanyCreate event: " + JSON.stringify(payload));
}}
```

## Use the appropriate payload attribute for callback with below syntax

```json
{
  "currentHost": {
    "subscribed_modules": [ "support_company" ],
    "endpoint_urls": {
      "freshdesk": "https://subdomain.freshdesk.com"
    }
  },
  "data": {
    "actor": {
      "account_id": 13,
      "parent_id": 0,
      "phone": "0987654321",
      "posts_count": 0,
      "preferences": {}
    },
    "privileges": "193248897710135786048173323961003191631436058972055363553917057189806079",
    "tags": []
  },
  "company": {},
  "event": "onCompanyCreate",
  "region": "US",
  "timestamp": 1636116484.5748038
}
```

---

>title: what are the REST APIs supported by support company module of Freshdesk
>tags: module=support_company, support_company, freshdesk, rest_api
>context: 
>content:

# What are the REST APIs supported by support company module of Freshdesk

The Freshdesk support company module supports following APIs

`POST /api/v2/companies`
`GET /api/v2/companies/[id]`
`GET /api/v2/companies`
`GET /api/v2/companies/autocomplete?name=[keyword]`
`GET /api/v2/search/companies?query=[query]`
`PUT /api/v2/companies/[id]`
`DELETE /api/v2/companies/[id]`
`POST api/v2/companies/export`
`GET api/v2/companies/export/[id]`
`GET api/v2/companies/imports`
`GET api/v2/companies/imports/[id]`

---