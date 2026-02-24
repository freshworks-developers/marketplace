>title: What are App Setup Events
>tags: Freshworks, app-setup-events, installation, update, uninstallation
>context: 
>content:

# What are App Setup Events

App setup events are events which allow you to automate tasks or update external systems with data from Freshworks. These are triggered when your app is installed, updated, or uninstalled on a Freshworks product.

---

>title: Considerations when using App Setup Events
>tags: Freshworks, app-setup-events, installation, update, uninstallation
>context: 
>content:

# Considerations when using App Setup Events

Following considerations when using App Setup Events:

### Summary of Considerations
1. The app setup events have 10 seconds timeout.
2. Only one listener can be registered for each event. Therefore, it is advisable to design your listener in such a way that it can handle all possible use cases.
3. If your app contains the `afterAppUpdate` event, app users are not automatically moved to the latest app version after it is available. The app users must click the Update button and manually upgrade.
4. If the `onAppUninstall` handler sends back response, the app can never be uninstalled. If the workflow is not critical, do not stop the app from being uninstalled unless required.
5. Need latest version of Chrome browser when testing.

---

>title: How to register App Setup Events
>tags: freshworks, app-setup-events, serverless
>context: manifest.json, server.js
>content:

# How to register App Setup Events

### Steps to Register App Setup Events
1.  When an app set-up event occurs, the corresponding event listener invokes a callback method and passes a standard payload to the method.
2.  In **server.js**, define the callback function.

  Subscribe to an event by configuring an event listener. To do this, include the events object within the modules.common object, specifying the app set-up event and the corresponding callback methods as follows.

manifest.json

```json
{
"modules": {
   "common": {
    "events": {
       "<eventName>": {
        "handler": "<eventCallbackMethod>"
       }
     }
   }
 }
}
```

---

>title: What are the Payload attributes?
>tags: freshworks, app-setup-events, serverless
>context: 
>content:

# What are the Payload attributes?

When an app set-up event occurs, a payload is passed to the callback method. The payload is a JSON object with the following attributes.

## Payload Attributes
- **currentHost** `object`: A global app, with module-specific app logic, can be deployed on various Freshworks products. **currentHost** contains information pertaining to the Freshworks product on which the app is currently running.
  - **endpoint_url** `object`: Product name and account url (domain name) of the host where the app can access the product resources, specified as a key (product name) - value (account URL) pairs. You can use the domain name to construct API calls that can access product resources.
  - **subscribed_modules** `array of strings`: All modules that the app user has subscribed to and present in the app manifest.
- **event** `string`: Identifier of the app set-up event.
  - Possible values: onAppInstall, onAppUninstall, afterAppUpdate.
- **iparams** `object`: Installation parameters specified as a JSON object of <parameter name>: <parameter value> pairs.
- **region** `string`: Region where the Freshworks product account is deployed.
  - Possible values: US, EU, EUC, AUS, and IND.
- **timestamp** `number`: Timestamp of when the app set-up event occurs, specified in the epoch format.

## Payload Schema

```json
{
  "currentHost": {
    "endpoint_urls": {
      "<product_name>": "value"
     },
    "subscribed_modules": [ "value" ]
  },
  "event": "value",
  "iparams": {
    "Param1" : "value",
    "Param2" : "value"
  },
  "region": "value",
  "timestamp": "value",
}
```

## Sample Payload

```json
{
  "currentHost": {
    "endpoint_urls": {
      "freshsales": "https://subdomain.freshsales.io",
      "freshworks_crm": "https://subdomain.myfreshworks.com"
     },
    "subscribed_modules": [ "deal", "contact", "cpq_document", "appointment", "sales_account", "task", "phone" ]
  },
  "event": "onAppInstall",
  "region": "US",
  "timestamp": 1496400354326,
}
```

---

>title: How to use onAppInstall event
>tags: Freshworks, app-setup-events, app-installation
>context: manifest.json, server.js
>content:

# How to use onAppInstall event

The `onAppInstall` event is triggered when a user installs your app. It can be used to perform specific actions like:

## Actions Performed on onAppInstall
1. Creating a database table
2. Initializing default settings
3. Sending welcome emails

For app installation to reach completion, in the callback function definition, use the `renderData()` method without any arguments. To disallow app installation if a mandatory action fails, use an error object as the argument - `renderData({error-object})`.

### Attributes of the error-object
- **message** string `Required`
  - Message indicating why the mandatory action failed. Should not exceed 60 characters.

For example,

```js
renderData({message: "Installation failed due to network error."});
```

### Configuring the `onAppInstall` event

1.  Subscribe to the `onAppInstall` event by using the following sample **manifest.json** content:

```json
{
"modules": {
   "common": {
     "events": {
       "onAppInstall": {
         "handler": "onAppInstallCallback"
       }
      }
   }
 }
}
```

2.  Define the corresponding callback that allows completion of installation by using the following sample **server.js** content:

```js
exports = {
 onAppInstallCallback: function(payload) {
   console.log("Logging arguments from onAppInstall event: " + JSON.stringify(payload));
   // If the setup is successful
   renderData();
  }
}
```

3.  Define the corresponding callback that disallows installation if a mandatory action fails, by using the following sample **server.js** content:

```js
exports = {
 onAppInstallCallback: function(payload) {
   console.log("Logging arguments from onAppInstall event: " + JSON.stringify(payload));
   // If there is an error during the setup
   renderData({message: "Invalid API Key"});
 }
}
```

---

>title: How to use afterAppUpdate event
>tags: Freshworks, app-setup-events, app-update
>context: manifest.json, server.js
>content:

# How to use afterAppUpdate event

The afterAppUpdate event is triggered when a user updates your app. Use this event to perform specific actions like:

## Actions Performed on afterAppUpdate
1. Updating a database table
2. Re-initializing settings
3. Sending update notifications

### In your new version's app files, you can:

-   Subscribe to the event by configuring event and its corresponding callback function.
-   Use the callback function to carry out certain app actions. To let an app user continue using the updated version, in the callback function definition, as part of the app logic, use the `renderData()` method without any arguments.
-   If any mandatory action that must be carried out as part of the app set-up (update) fails, if the mandatory parameters that are required to carry out the app actions are unavailable, or in any such error scenarios, use the registered callback function to revert to the earlier installed app version. To perform this, use an error object as the argument of the renderData() method - `renderData({error-object})`.

### Attributes of the error-object
-  **message** string `Required`
    - Message indicating why the mandatory action failed. Should not exceed 60 characters.

For example,

```js
renderData({message: "Invalid API key. App reverted to previous version. Try updating again."});
```

### Configuring the `afterAppUpdate` event

1.  Subscribe to the `afterAppUpdate` event by using the following sample **manifest.json** content:

```js
"modules": {
   "common": {
     "events": {
       "afterAppUpdate": {
         "handler": "afterAppUpdateCallback"
       }
     }
   }
 }
```

2.  Define the corresponding callback that does not interrupt usage of the updated app, by using the following sample **server.js** content:

```js
exports = {
 afterAppUpdateCallback: function(payload) {
   console.log("Logging arguments from afterAppUpdate event: " + JSON.stringify(payload));
   // If the setup is successful
   renderData();
  }
}
```

3.  Define the corresponding callback that reverts the app to the earlier installed version if a mandatory action fails, by using the following sample **server.js** content:

```js
exports = {
 afterAppUpdateCallback: function(payload) {
   console.log("Logging arguments from afterAppUpdate event: " + JSON.stringify(payload));
   // To revert to earlier installed app version.
  renderData({message: "Updating to the latest version of the app failed due to network error."});
 }
}
```

 **Note:** If your app contains the `afterAppUpdate` event, app users are not automatically moved to the latest app version after it is available. The app users must click the Update button and manually upgrade.

---

>title: How to use onAppUninstall events
>tags: Freshworks, app-setup-events, app-uninstallation
>context: manifest.json, server.js
>content:

# How to use onAppUninstall events

The onAppUninstall event is triggered when a user uninstalls your app. Use this event to perform specific actions like:

## Actions Performed on onAppUninstall
1. Deleting a database table
2. Cleaning up resources
3. Sending goodbye emails

For app uninstallation to reach completion, in the callback function definition, use the `renderData()` method without any arguments. To disallow app uninstallation if a mandatory action fails, use an error object as the argument - `renderData({error-object})`.

### Attributes of the error-object
- **message** string `Required`
  - Message indicating why the mandatory action failed. Should not exceed 60 characters.

For example,

```js
renderData({message: "Uninstallation failed due to network error."});
```

### Configuring the `onAppUninstall` event

1. Subscribe to the `onAppUninstall` event by using the following sample **manifest.json** content:

```js
"modules": {
 "common": {
    "events": {
     "onAppUninstall": {
       "handler": "onAppUninstallCallback"
     }
   }
  }
 }
```

2. Define the corresponding callback that allows completion of uninstallation, by using the following sample **server.js** content:

```js
exports = {
  onAppUninstallCallback: function(payload) {
    console.log("Logging arguments from onAppUninstall event: " + JSON.stringify(payload));
  // If all mandatory uninstallation actions are successful
    renderData();
    }
  }
```

3. Define the corresponding callback that disallows uninstallation if a mandatory action fails, by using the following sample **server.js** content:

```js
exports = {
  onAppUninstallCallback: function(payload) {
    console.log("Logging arguments from onAppUninstall event: " + JSON.stringify(payload));
    // If there is an error during uninstallation
    renderData({message: "Uninstallation failed due to network error"});
  }
}
```

---

>title: Testing App Setup Events Locally
>tags: serverless, app-setup-events, testing
>context: manifest.json
>content:

# Testing App Setup Events Locally

### Steps to test the scheduled events in local simulation
1. Navigate to the system settings page at http://localhost:10001/system_settings. All modules configured in the App manifest are listed.
2. In the system settings page,
  a. Select the modules for which you want to test the app logic. The **Enter account URL** section is displayed, with a prompt to enter the account URLs for all selected modules.
  b. In the **Enter account URL** section, enter valid account URL(s) for the product(s) to which the selected modules belong. During app testing, this URL plays the role of the **currentHost**. Based on the **currentHost**, the `currentHost.subscribed_modules` and `currentHost.endpoint_urls` are determined.
  c. Click **Continue**.
3. If you have configured installation parameters for the app, the App Settings page is displayed at `http://localhost:10001/custom_configs`. Enter appropriate values for the installation parameters and click **Install**.
4. Navigate to `http://localhost:10001/web/test` to test the serverless events that the app uses. All modules that you select in the system settings page, for which serverless events are registered in the app manifest, are listed in the **Select module** drop-down.
5. From the **Select module** drop-down, select **Common**. The Select an event drop-down is displayed and it lists all the events configured (in the app manifest) for the common module.
6. From the **Select an event** drop-down, select the event you want to test. The payload for the event is populated on the page.
7. Click **Simulate**. If the event is simulated successfully, the Simulate button’s display name changes to **Success**. The event payload is added to the **<app's root directory>/server/test_data** folder.

To test more events, select another appropriate module and event and click **Simulate**. If the event simulation fails because of invalid payload data, the **Simulate** button’s display name changes to **Failed**. Modify the payload appropriately and click **Simulate**.

---