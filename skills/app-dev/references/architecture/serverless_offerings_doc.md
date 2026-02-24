>title: what are Freshworks Serverless Offerings
>tags: serverless, serverless-offerings
>context: 
>content:

# what are Freshworks Serverless Offerings
The Freshworks app development platform provides a serverless environment to enable developers to create apps that run in response to events such as Freshdesk product, app setup, and external events. To use this feature, configure an event listener and the corresponding callback method. The event triggers, the callback method and is executed on a server.

## Serverless vs Front-end apps
The serverless events are in contrast to front-end apps which run in response to events, such as a Ticket page load or a button click, which are executed on the client’s browser (UI).

---

>title: what are the usecases to use Freshworks Serverless Offerings
>tags: serverless, serverless-offerings
>context: 
>content:

# what are the usecases to use Freshworks Serverless Offerings
Following are the usecases in which serverless apps can be used

## Summary
1. Custom Automations
2. Data Synchronization
3. Alerts and Notifications
4. Server Method Invocation

---

>title: what are Freshworks Serverless Offerings considerations
>tags: serverless, serverless-offerings
>context: 
>content:

# what are Freshworks Serverless Offerings considerations

## Summary
1. The serverless apps are run in the sandbox mode. Therefore, usage of methods such as `process`, `buffer`, `clearImmediate`, `clearInterval`, `clearTimeout`, `setImmediate`, `setInterval`, and `setTimeout` in the app logic is not supported.
2. The app execution timeout is 20 seconds.

## Sandbox Mode
The serverless apps are run in the sandbox mode. Therefore, usage of methods such as `process`, `buffer`, `clearImmediate`, `clearInterval`, `clearTimeout`, `setImmediate`, `setInterval`, and `setTimeout` in the app logic is not supported.

## Execution Timeout
The app execution timeout is 20 seconds.

---

>title: Steps to create a serverless app from FDK CLI
>tags: serverless, serverless-offerings
>context: 
>content:

# Steps to create a serverless app from FDK CLI

## Summary
1. Create a new directory.
2. Navigate to the directory.
3. Run FDK create command.

### Step 1: Create a new directory
Create a new directory: `mkdir [dir_name]` (replace `[dir_name]` with the app name).

### Step 2: Navigate to the directory
Navigate to `[dir_name]`: `cd [dir_name]`.

### Step 3: Run FDK create command
Run `fdk create --products freshdesk --template your_first_serverless_app` to create the app directory with the following structure:
- `server/` (Contains files and folders for the serverless component of the app, adhering to the ES6 standard).
- `server.js` (Contains event registration and callback methods).
- `test_data/` (Includes sample payloads for each event, used during local testing).
- `config/` (Contains installation parameter files).
- `manifest.json` (Contains platform version, product, event declarations, Node.js and FDK versions, and npm package dependencies).

---

>title: Steps to configure or build a serverless app
>tags: serverless, serverless-offerings
>context: manifest.json, server.js
>content:

# Steps to configure or build a serverless app

## Summary
1. Configure the app manifest.
2. Implement app logic.
3. Replace default code.
4. Configure app listener.
5. Set up event configurations.
6. Data management.
7. Developer toolkit.
8. NPM packages.
9. Secure HTTP calls.
10. Instance communication.
11. OAuth authentication.
12. Data persistence.
13. App settings configuration.

### Step 1: Configure the app manifest
Configure the app manifest: Subscribe to a serverless event by setting up an event listener. When the event occurs, the listener invokes a callback method with a standard payload.

### Step 2: Implement app logic
Implement app logic: Define your app's functionality.

### Step 3: Replace default code
Replace default code: In `server.js`, replace the default code with your app logic, including the callback method definition.

### Step 4: Configure app listener
Configure app listener: Use serverless methods to configure the app listener and define your app logic.

### Step 5: Set up event configurations
Set up event configurations:
- For app installation, uninstallation, or updates, configure appropriate app set-up events.
- For events in the parent application, use the appropriate product event configuration.
- For events in external products, use the appropriate external event configuration.
- For scheduled events, use the appropriate scheduled event configuration.

### Step 6: Data management
Data management: Utilize data storage tools to persist and use data throughout your app's lifecycle.

### Step 7: Developer toolkit
Developer toolkit: Employ the developer toolkit to address specific app requirements.

### Step 8: NPM packages
NPM packages: Provision and include npm packages into your app files.

### Step 9: Secure HTTP calls
Secure HTTP calls: Use the request method to securely make HTTP calls to third-party domains.

### Step 10: Instance communication
Instance communication: Enable communication between different instances of your app using the instance method.

### Step 11: OAuth authentication
OAuth authentication: Enable access to third-party resources requiring OAuth authentication using the provision for OAuth requests.

### Step 12: Data persistence
Data persistence: Continue to utilize data storage tools for persisting and using data throughout your app's lifecycle.

### Step 13: App settings configuration
App settings configuration: Lastly, configure app settings to ensure proper functionality.

---

>title: Steps to configure environment for custom app development
>tags: serverless, serverless-offerings
>context: server.js
>content:

# Steps to configure environment for custom app development
When creating a serverless custom app, in `server.js`, you can include the `process.env.ENV` environment variable to run different app logic in the test and production environments using the following syntax:
```js
if(process.env.ENV === "test") {
  //test environment execution statements
}
  or
if(process.env.ENV === "production") {
  //production environment execution statements
}
```

---

>title: How to test a serverless app locally
>tags: serverless, testing
>context: server.js
>content:

# How to test a serverless app locally

## Summary
1. Use the latest version of Chrome for testing.
2. Local testing provides a simulation environment without creating records in the backend.
3. For backend data persistence during testing, publish the app as a custom app and test events manually.
4. Ensure sample payload JSON files are available at `[app-root-directory]/server/test_data`.
5. To simulate the app runtime:
   - Execute `fdk run` from the command line.
   - Go to `https://localhost:10001/web/test`.
   - Click "Select an event" to see the list of configured events in `server.js`.
      - To test app setup events, select `onAppInstall`, `afterAppUpdate`, or `onAppUninstall`.
      - To test external events, select `onExternalEvent`.
      - To test scheduled events, select `onScheduledEvent`.
      - To test a product event, choose the corresponding product event name.
      - To test the default serverless app created from the `your_first_serverless_app` template, select `onTicketCreate`.
6. Once an event is selected, the corresponding payload is displayed. Edit the payload for different scenarios.
7. Click "Simulate":
   - If the event simulation is successful, the "Simulate" button changes to "Success".
   - If the event simulation fails due to an invalid payload, the "Simulate" button changes to "Failed".
   - For a failed simulation, modify the payload appropriately and click "Simulate" again.

### Step 1: Use the latest version of Chrome
Use the latest version of Chrome for testing.

### Step 2: Local testing without backend records
Local testing provides a simulation environment without creating records in the backend.

### Step 3: Backend data persistence
For backend data persistence during testing, publish the app as a custom app and test events manually.

### Step 4: Ensure sample payload JSON files
Ensure sample payload JSON files are available at `[app-root-directory]/server/test_data`.

### Step 5: Simulate the app runtime
To simulate the app runtime:
- Execute `fdk run` from the command line.
- Go to `https://localhost:10001/web/test`.
- Click "Select an event" to see the list of configured events in `server.js`.
   - To test app setup events, select `onAppInstall`, `afterAppUpdate`, or `onAppUninstall`.
   - To test external events, select `onExternalEvent`.
   - To test scheduled events, select `onScheduledEvent`.
   - To test a product event, choose the corresponding product event name.
   - To test the default serverless app created from the `your_first_serverless_app` template, select `onTicketCreate`.

### Step 6: Edit the payload
Once an event is selected, the corresponding payload is displayed. Edit the payload for different scenarios.

### Step 7: Click "Simulate"
Click "Simulate":
- If the event simulation is successful, the "Simulate" button changes to "Success".
- If the event simulation fails due to an invalid payload, the "Simulate" button changes to "Failed".
- For a failed simulation, modify the payload appropriately and click "Simulate" again.

