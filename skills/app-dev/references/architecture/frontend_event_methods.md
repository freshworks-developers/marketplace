>title: What are events method and how do I enable it in my app?
>tags: events, front-end, initialization
>context: app.js
>content:

# What are events method and how do I enable it in my app?

Front-end events are actions on the product UI, such as button clicks and changes to field values. The `events` method is an interface provided by the developer platform to let your app react to these front-end events.

To enable your app to react to front-end events in your `app.js` file:

1. Subscribe to the `app.initialized` event through an event listener. When the app is initialized, the parent application passes a client reference to the app.
2. After the app is initialized, use the client reference to subscribe to an event by name and register a callback to run when that event occurs.
3. Define the callback method. When the event occurs, a payload is passed to the callback. Let us call it `event`.
   - `event.type` is the name of the event.
   - `event.helper.getData()` returns a JSON object containing data relevant to the event.
   - Your app logic can then process this data as needed.

---

>title: What front-end event types are common across all products?
>tags: events, front-end, intercept, types
>context: app.js
>content:

# What front-end event types are common across all products?

Below are the three main types of front-end events:

1. **Click events**  
   These occur when a user clicks a button or link on the page.  
   - For most click events, `event.helper.getData()` returns an empty JSON, unless additional data is provided (for example, timer events)

2. **Change events**  
   These occur when a user changes the value of a field on the UI.  
   - Merely changing the value triggers the event; no submission is required.

3. **Intercept events**  
   These are events that are paused while the event listener and the corresponding callback run.  
   - The app can allow the original event to complete or block it.  
   - Intercepting is enabled by passing `{ intercept: true }` when subscribing to the event.

---

>title: Which click events are supported for a common module app?
>tags: events, common-module, front-end, click
>context: app.js
>content:

# Which click events are supported for a common module app?

When building a common module app, you must specify at least one other module in your app manifest. The `events` method only works if at least one of your non-common modules is in the following list. Otherwise, you cannot use it.

If the other module is **one** of the following (and the app is deployed on the Freshdesk product at the `cti_global_sidebar` placeholder):

- `support_email`
- `support_ticket`
- `support_portal`
- `support_agent`
- `support_contact`
- `support_company`

The **click event** available is:

1. `cti.triggerDialer`
   - Triggered when a user clicks the call icon or phone number link on:
     - **Ticket details page** > CONTACT DETAILS widget
     - **Ticket list page** > Contact hover card
     - **New ticket page** > CONTACT DETAILS widget
     - **Contact list page** > Contact hover card
     - **Contact details page** > Contact header and DETAILS widget

If the other module is **one** of the following (and the app is deployed on Freshsales Classic or Freshsales Suite at the `left_nav_cti` placeholder):

- `appointment`
- `contact`
- `cpq_document`
- `deal`
- `phone`
- `product`
- `sales_account`
- `task`
- `lead` (Freshsales Classic only)

The **click event** available is:

1. `calling`
   - Triggered when a user clicks the call icon or phone number link on:
     - **Contact list page** > Contact hover card > Make call widget
     - **Contact list page** > Work phone field
     - **Contact details page** > Work phone and Mobile fields
     - **Contact details page** > Make call widget

---
>title: How do I handle calling and cti.triggerDialer events?
>tags: events, front-end, calling, cti.triggerDialer
>context: app.js
>content:

# How do I handle calling and cti.triggerDialer events?

## Calling

Use the sample code below to enable your app to react to user clicks, such as a click on a call icon or phone number in the UI.

```js
// Configure event listener and subscribe to event
// Register callback
client.events.on("calling", eventCallback);

var eventCallback = function (event) {
  // Retrieve event data
  var data = event.helper.getData();
  // App logic
};
```

Payload

```json
{
  "phoneNumber": "3684932360"
}
```

## cti.triggerDialer

Use the sample code below to enable your app to react to user clicks, such as a click on a call icon or phone number in the UI.

```js

// Configure event listener and subscribe to event
// Register callback
client.events.on("cti.triggerDialer", eventCallback);

var eventCallback = function (event) {
  // Retrieve event data
  var data = event.helper.getData();
  // App logic
};
```

Payload

```json
{
  "number": "+12345678900"
}
```

---
