>title: what is Scheduled Events
>tags: serverless, scheduled-events, scheduler, cron
>context: server.js
>content:

# what is Scheduled Events

Create scheduled events to invoke serverless apps. At the specified time, the relevant serverless method in the app is executed.

### Parameters:
1. `name` (string) - Unique identifier for the schedule.
2. `data` (JSON) - Data to be passed to the schedule event handler when fired.
3. `schedule_at` (time in ISO format) - Time for triggering the schedule. For recurring schedules (with time_unit as days), the hour and minutes are taken from `schedule_at`.
4. `time_unit` (string) - Time unit for recurring schedule (minutes, hours, or days).
5. `frequency` (number) - Execution frequency with respect to the time unit.

---

>title: how to register Scheduled Events
>tags: serverless, scheduled-events, scheduler, cron
>context: manifest.json, server.js
>content:

# how to register Scheduled Events

### Steps to register a scheduled event and the corresponding callback:
1. To register a scheduled event and the corresponding callback, Update `manifest.json` as below:
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

2. In the `server.js` file exports block, enter the callback function definition as follows:
   ```js
   exports = {
       onScheduledEventHandler: function(payload) {
           if (payload.data.account_id === "3") {
               //app logic goes in here
           }
       }
   };
   ```

---

>title: how to create one-time or recurring Scheduled Event
>tags: serverless, scheduled-events, scheduler, cron
>context: server.js
>content:

# how to create one-time or recurring Scheduled Event

### To create a one-time schedule:
```js
try {
    let data = await $schedule.create({
        name: "ticket_reminder",
        data: {
            ticket_id: 100001
        },
        schedule_at: "2018-06-10T07:00:00.860Z",
    });
    //"data" is a json with status and message.
} catch (error) {
    // //"error" is a json with status and message.
    console.error(error)
}
```

### To create a recurring schedule:
```js
try {
    let data = await $schedule.create({
        name: "ticket_reminder",
        data: {
            ticket_id: 10001
        },
        schedule_at: "2018-06-10T07:00:00.860Z",
        repeat: {
            time_unit: "minutes",
            frequency: 5
        }
    });
    //"data" is a json with status and message.
} catch (error) {
    // //"error" is a json with status and message.
}
```

---

>title: how to fetch a schedule
>tags: serverless, scheduled-events, scheduler, cron
>context: server.js
>content:

# how to fetch a schedule

### To fetch a schedule:
```js
try {
    let data = await $schedule.fetch({
        name: "ticket_reminder"
    });
    //"data" is a json with name, data and schedule_at used to create the schedule
} catch (error) {
    // error is a json with status and message.
}
```

---

>title: how to update a schedule
>tags: serverless, scheduled-events, scheduler, cron
>context: server.js
>content:

# how to update a schedule

### To update a schedule:
```js
try {
    let data = await $schedule.update({
        name: "ticket_reminder",
        data: {
            ticket_id: 10001
        },
        schedule_at: "2018-06-10T07:00:00.860Z",
        repeat: {
            time_unit: "hours",
            frequency: 1
        }
    });
    //"data" is a json with status and message.
} catch (error) {
    // “error” is a json with status and message.
}
```

---

>title: how to delete a schedule
>tags: serverless, scheduled-events, scheduler, cron
>context: server.js
>content:

# how to delete a schedule

### To delete a schedule:
```js
try {
    let data = await $schedule.delete({
        name: "ticket_reminder"
    });
    //"data" is a json with status and message.
} catch (error) {
    // “error” is a json with status and message.
}
```

---

>title: how to test Scheduled Events
>tags: serverless, scheduled-events, scheduler, cron
>context: 
>content:

# how to test Scheduled Events

### Steps to test scheduled events in local simulation:

1. Go to the system settings page at http://localhost:10001/system_settings. All modules configured in the App manifest are listed.
2. In system settings page:
   a. Select the modules for testing the app logic. The **Enter account URL** section is displayed, with a prompt to enter the account URLs for all selected modules.
   b. In the Enter account URL section, enter valid account URL(s) for the product(s) for the selected modules. During app testing, this URL plays the role of the currentHost. Based on the currentHost, the currentHost.subscribed_modules and currentHost.endpoint_urls are determined.
   c. Click Continue.
3. To configure installation parameters, go to `http://localhost:10001/custom_configs`, enter appropriate values for the installation parameters and click Install.
4. Go to http://localhost:10001/web/test to test the serverless events. Selected modules are listed in the **Select module** drop-down.
5. Select **Common** from the **Select module** drop-down; it shows the **Select an event** drop-down which lists all the events configured (in the app manifest) for the **common** module.
6. Select **onScheduledEvent** from **Select an event** drop-down. The payload for the event is populated on the page.
7. Click **Simulate**. If the event is simulated successfully, the **Simulate** button’s display name changes to **Success**. The event payload is added to the <app's root directory>/server/test_data folder.
8. To test more events, select the module and event and click **Simulate**. If the event simulation fails because of invalid payload data, the **Simulate** button’s display name changes to Failed. Modify the payload appropriately and click **Simulate**.

---