>title: what is support portal module in Freshdesk
>tags: module=support_portal, support_portal, freshdesk
>context: 
>content:

# what is support portal module in Freshdesk

An app user with a stand-alone Freshdesk subscription or a subscription to any SKU that has Freshdesk as one of the products can use this module. Using this module you can build a front end app, a serverless app and also a full stack SMI app for Freshdesk Ticket feature. The front end and SMI apps is deployed on the supported product’s left-navigation pane. The app cannot be deployed on any other pages of the product.	 

---

>title: what are the placeholders supported for support portal module in Freshdesk
>tags: module=support_portal, support_portal, freshdesk
>context: manifest.json
>content:

# what are the placeholders supported for support portal module in Freshdesk

## Common placeholders

It supports following Common placeholders. In the app manifest, configure these placeholders at modules.common.
1. Full Page App as `full_page_app`
2. CTI Global sidebar as `cti_global_sidebar`

---

>title: how to use placeholders supported for support portal module in Freshdesk
>tags: module=support_portal, support_portal, freshdesk
>context: manifest.json
>content:

# how to use placeholders supported for support portal module in Freshdesk

To use the placeholders modify your `manifest.json` as below 
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
    }
  }
}
```

---

>title: data methods supported for support portal module in Freshdesk
>tags: module=support_portal, support_portal, freshdesk, data_method
>context: 
>content:

# data methods supported for support portal module in Freshdesk

You can use the `client.data.get()` data method to retrieve the following objects.

## Objects accessible regardless of the placeholders

1. currentHost
2. loggedInUser

---

>title: example of data method usage supported for support portal module in Freshdesk
>tags: module=support_portal, support_portal, freshdesk
>context: 
>content:

# example of data method usage supported for support portal module in Freshdesk

## Retrieve current host information

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

## Retrieve loggedInUser information

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

>title: what are events methods supported for support portal module in Freshdesk
>tags: module=support_portal, support_portal, freshdesk, events_method
>context: 
>content:

# what are events methods supported for support portal module in Freshdesk

## Common event

An app deployed at cti_global_sidebar can react to the `cti.triggerDialer` event. It gets triggered when user clicks on:
1. Ticket details page > CONTACT DETAILS widget
2. Ticket list page > Contact hover card
3. New ticket page > CONTACT DETAILS widget
4. Contact list page > Contact hover card
5. Contact details page > Contact header and DETAILS widget

---

>title: how to use events methods supported for support portal module in Freshdesk
>tags: module=support_portal, support_portal, freshdesk, events_method
>context: 
>content:

# how to use events methods supported for support portal module in Freshdesk

To use `cti.triggerDialer` use the following code:

```js
{
  // Configure event listener and subscribe to event
  // Register callback
  client.events.on("cti.triggerDialer", eventCallback);
  var eventCallback = function (event) {
    // Retrieve event data
    var data = event.helper.getData();
    // App logic
  };
}
```

---

>title: what are interface methods supported for support portal module in Freshdesk
>tags: module=support_portal, support_portal, freshdesk, interface_methods
>context: 
>content:

# what are interface methods supported for support portal module in Freshdesk

The following methods are supported

1. Display modals or dialog boxes - `showModal` method and `showDialog` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`
4. Display or hide CTI dialler
5. Display or hide missed calls in the CTI widget
6. `click` method on Open Ticket or Contact details page

---

>title: how to use interface methods supported for support portal module in Freshdesk
>tags: module=support_portal, support_portal, freshdesk, interface_methods
>context: 
>content:

# how to use interface methods supported for support portal module in Freshdesk

## Show modal or dialog

```js
try {
  let data = client.interface.trigger('showDialog', {
    title: 'Sample Dialog',
    template: 'dialog.html' 
  });
  console.log(data); // success message
} catch (error) {
  // failure operation
  console.error(error);
}
```

## Display notifications

```js
client.interface.trigger("showNotify", {
    type: "<Possible values: info, success, warning, danger, alert>",
    title: "<Display name>",
    message: "<text message to be displayed in the notification box>"
  }
)
```

---

>title: what are instance methods supported for support portal module in Freshdesk
>tags: module=support_portal, support_portal, freshdesk, instance_methods
>context: 
>content:

# what are instance methods supported for support portal module in Freshdesk

1. `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
2. `client.instance.close()` to close the instance
3. Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to:
   1. Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   2. Send data from a modal to a parent placeholder and get the data in the parent.
   3. Send data from one instance to another instance and receive data at the destination.

---

>title: how to use instance methods supported for support portal module in Freshdesk
>tags: module=support_portal, support_portal, freshdesk, instance_methods
>context: 
>content:

# how to use instance methods supported for support portal module in Freshdesk

1. Send data from a parent placeholder to a modal and retrieve the context/data in the modal

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

2. Send data from a modal to a parent placeholder and get the data in the parent

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
    }
    */
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

3. Send data from one instance to another instance and receive data at the destination

- In placeholder 1

```js
client.instance.get().then(
  function(data) {
    console.log(data);
    /* output: [
      {
        instanceId: "1",
        location: "place_holder1"
      },
      {
        instanceId: "2",
        location: "place_holder2"
      }
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

>title: what are the serverless events supported by support portal module of Freshdesk
>tags: module=support_portal, support_portal, freshdesk, serverless_events
>context: manifest.json
>content:

# what are the serverless events supported by support portal module of Freshdesk

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

In the app manifest, configure these events at `modules.support_portal`.
1. `onTopicCreate`
2. `onTopicUpdate`
3. `onTopicDelete`
4. `onForumCreate`
5. `onForumUpdate`
6. `onForumDelete`
7. `onForumCategoryCreate`
8. `onForumCategoryUpdate`
9. `onForumCategoryDelete`
10. `onPortalForumCategoryCreate`
11. `onPortalForumCategoryDelete`
12. `onArticleCreate`
13. `onArticleUpdate`
14. `onArticleDelete`
15. `onPortalSolutionCategoryCreate`
16. `onPortalSolutionCategoryDelete`
17. `onFolderCreate`
18. `onFolderUpdate`
19. `onFolderDelete`
20. `onSurveyCreate`
21. `onSurveyUpdate`
22. `onCategoryCreate`
23. `onCategoryUpdate`
24. `onCategoryDelete`

---

>title: how to configure product events supported by support portal module of Freshdesk
>tags: module=support_portal, support_portal, freshdesk, product_events
>context: manifest.json, server.js
>content:

# how to configure product events supported by support portal module of Freshdesk

## Subscribe to an event by configuring an event listener in `manifest.json`

```json
"events": {
  "<productEventName>": {
      "handler": "<eventCallbackMethod>"
  }
}
```

## In `server.js` file under the exports block, enter the callback function definition

```js
exports = {
  // args is a JSON block containing the payload information
  // args["iparam"] will contain the installation parameter values
  // eventCallbackMethod is the call-back function name specified in manifest.json
  eventCallbackMethod: function(args) {
    console.log("Logging arguments from the event: " + JSON.stringify(payload));
  }
};
```

## Use the appropriate payload attribute for callback

```json
{
  "currentHost": {
    "subscribed_modules": [ "support_portal" ],
    "endpoint_urls": {
      "freshdesk": "value"
    }
  },
  "data" : {
    // Contains the list of objects related to the event.
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

>title: how to configure category events supported by support portal module of Freshdesk
>tags: module=support_portal, support_portal, freshdesk, product_events, ticket_events
>context: manifest.json, server.js
>content:

# how to configure category events supported by support portal module of Freshdesk

## Subscribe to category event by configuring an event listener in `manifest.json`

```json
"events": {
  "onCategoryCreate": {
    "handler": "onCategoryCreateCallback"
  }
}
```

## In `server.js` file under the exports block, enter the callback function definition

```js
exports = {
  onCategoryCreateCallback: function(payload) {
    console.log("Logging arguments from onCategoryCreate event: " + JSON.stringify(payload));
  }
}
```

## Use the appropriate payload attribute for callback

```json
{
  "currentHost": {
    "subscribed_modules": [ "support_portal" ],
    "endpoint_urls": {
      "freshdesk": "https://subdomain.freshdesk.com"
    }
  },
  "data": {
    "actor": {
      "account_id": 13,
      "first_name": "Rachel",
      "helpdesk_agent": true,
      "id": 276,
      "preferences": {}
    },
    "associations": {},
    "category": {
      "account_id": 13,
      "category_id": 432,
      "created_at": "2021-10-29T13:42:42Z",
      "description": "this is a category for Grocery items",
      "id": 432,
      "language_code": "en",
      "language_id": 6,
      "name": "Sample Category",
      "updated_at": "2021-10-29T13:42:42Z"
    }
  },
  "event": "onCategoryCreate",
  "region": "AUS",
  "timestamp": 1635514962.246033,
  "version": "1.0.5"
}
```

---

>title: what are the REST APIs supported by support portal module of Freshdesk
>tags: module=support_portal, support_portal, freshdesk, rest_api
>context: 
>content:

# what are the REST APIs supported by support portal module of Freshdesk

The Freshdesk support portal module supports following APIs:

## Categories Endpoint

- `POST /api/v2/discussions/categories`
- `GET /api/v2/discussions/categories/[id]`
- `GET /api/v2/discussions/categories`
- `GET /api/v2/discussions/categories/[id]/forums`
- `PUT /api/v2/discussions/categories/[id]`
- `DELETE /api/v2/discussions/categories/[id]`
- `POST /api/v2/discussions/categories/[category_id]/forums`
- `GET /api/v2/discussions/forums/[id]`
- `GET /api/v2/discussions/forums/[id]/topics`
- `PUT /api/v2/discussions/forums/[id]`
- `DELETE /api/v2/discussions/forums/[id]`
- `POST /api/v2/discussions/forums/[id]/follow`
- `DELETE /api/v2/discussions/forums/[forum_id]/follow?user_id=[user_id]`
- `GET /api/v2/discussions/forums/[id]/follow?user_id=[id]`
- `POST /api/v2/discussions/forums/[forum_id]/topics`
- `GET /api/v2/discussions/topics/[id]`
- `GET /api/v2/discussions/topics/[id]/comments`
- `PUT /api/v2/discussions/topics/[id]`
- `DELETE /api/v2/discussions/topics/[id]`
- `POST /api/v2/discussions/topics/[id]/follow`
- `DELETE /api/v2/discussions/topics/[topic_id]/follow?user_id=[user_id]`
- `GET /api/v2/discussions/topics/[id]/follow?user_id=[id]`
- `GET /api/v2/discussions/topics/followed_by?user_id=[id]`
- `GET /api/v2/discussions/topics/participated_by?user_id=[id]`
- `POST /api/v2/discussions/topics/[topic_id]/comments`
- `PUT /api/v2/discussions/comments/[id]`
- `DELETE /api/v2/discussions/comments/[id]`

## Solutions Endpoint

- `POST /api/v2/solutions/categories`
- `POST /api/v2/solutions/categories/[id]/[language_code]`
- `PUT /api/v2/solutions/categories/[id]`
- `PUT/api/v2/solutions/categories/[id]/[language_code]`
- `GET /api/v2/solutions/categories/[id]`
- `GET/api/v2/solutions/categories/[id]/[language_code]`
- `GET /api/v2/solutions/categories`
- `GET/api/v2/solutions/categories/[language_code]`
- `DELETE /api/v2/solutions/categories/[id]`
- `POST /api/v2/solutions/categories/[id]/folders`
- `POST /api/v2/solutions/folders/[id]/[language_code]`
- `PUT /api/v2/solutions/folders/[id]`
- `PUT /api/v2/solutions/folders/[id]/[language_code]`
- `GET /api/v2/solutions/folders/[id]`
- `GET /api/v2/solutions/folders/[id]/[language_code]`
- `GET /api/v2/solutions/categories/[category_id]/folders`
- `GET /api/v2/solutions/categories/[category_id]/folders/[language_code]`
- `GET /api/v2/solutions/folders/[folder_id]/subfolders`
- `GET /api/v2/solutions/folders/[folder_id]/subfolders/[language_code]`
- `DELETE /api/v2/solutions/folders/[id]`
- `POST /api/v2/solutions/folders/[id]/articles`
- `POST /api/v2/solutions/articles/[id]/[language_code]`
- `PUT /api/v2/solutions/articles/[id]`
- `PUT /api/v2/solutions/articles/[id]/[language_code]`
- `GET /api/v2/solutions/articles/[id]`
- `GET /api/v2/solutions/articles/[id]/[language_code]`
- `GET /api/v2/solutions/folders/[id]/articles`
- `GET /api/v2/solutions/folders/[id]/articles/[language_code]`
- `DELETE /api/v2/solutions/articles/[id]`
- `GET /api/v2/search/solutions?term=[keyword]`

---
