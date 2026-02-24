>title: Detailed instructions for testing a global app of type frontend app
>tags: cli, fdk, testing, frontend_app, global_app
>context: apps.js
>content:

# Detailed instructions for testing a global app of type frontend app

## Summary
1. **Latest Chrome Requirement:** Ensure you have the latest version of Chrome.
2. **Run FDK Command:** Execute `fdk run` to start the local test server.
3. **System Settings:** Configure testing modules and account URLs.
4. **App Settings (if applicable):** Provide installation parameters if needed.
5. **Test in Freshworks Product:** Verify app rendering and functionality.
6. **Code Coverage:** Ensure sufficient code coverage and attach logs for troubleshooting.

## Detailed Steps

### Step 1: Latest Chrome Requirement
- Ensure you have the latest version of Chrome installed.

### Step 2: Run FDK Command
- **Navigate:** Go to your app's directory in the command line.
- **Execute Command:** Run the command `fdk run`. This starts the local test server.
- **Result:** The test URLs for the product UI, App Settings, and serverless events simulation will be displayed.

### Step 3: System Settings
- **Access URL:** Open [http://localhost:10001/system_settings](http://localhost:10001/system_settings) in your browser.
- **Select Modules:** Choose the modules you want to test.
- **Enter URLs:** Provide valid account URLs for the corresponding products in the "Enter account URL" section. These URLs serve as the currentHost during testing.
- **Continue:** Click **Continue**.

### Step 4: App Settings (if applicable)
- **Access URL:** If your app has installation parameters, the App Settings page will open at [http://localhost:10001/custom_configs](http://localhost:10001/custom_configs).
- **Enter Parameters:** Fill in the required values and click **Install**.
- **No Parameters:** If there are no parameters, a message will indicate that the app doesn't have an installation page.

### Step 5: Test in Freshworks Product
- **Log In:** Sign in to the Freshworks account where you want to test the app.
- **Modify URL:** Append `?dev=true` to the default account URL shown in the address bar.  
  _Example:_ `https://domain.myfreshworks.com/crm/sales/contacts/view/401033886912?dev=true`
- **Verify:** Navigate to the location where the app is expected to be deployed and verify that the app renders correctly while testing its functionality.

### Step 6: Code Coverage
- **Code Coverage:** Aim for at least 80% code coverage for successful publication in the Freshworks Marketplace. (See "Code coverage" for details.)
- **Support:** Attach detailed logs to your support ticket to help with faster troubleshooting in case of issues.

---
>title: Detailed instructions for testing a global app of type serverless app
>tags: cli, fdk, testing, serverless_app, global_app
>context: server.js
>content:

# Detailed instructions for testing a global app of type serverless app

## Summary
1. **Latest Chrome Requirement:** Ensure you have the latest version of Chrome.
2. **Run FDK Command:** Execute `fdk run` to start the local test server.
3. **System Settings:** Configure testing modules and account URLs.
4. **App Settings (if applicable):** Provide installation parameters if needed.
5. **Test Serverless Events:** Simulate serverless events using the test interface.
6. **Additional Notes:** Understand payload differences and test event options.

## Detailed Steps

### Step 1: Latest Chrome Requirement
- Ensure you have the latest version of Chrome installed.

### Step 2: Run FDK Command
- **Navigate:** Go to your app's directory in the command line.
- **Execute Command:** Run the command `fdk run`. This starts the local test server.
- **Result:** The test URLs for the product UI, App Settings, and serverless events simulation will be displayed.

### Step 3: System Settings
- **Access URL:** Open [http://localhost:10001/system_settings](http://localhost:10001/system_settings) in your browser.
- **Select Modules:** Choose the modules you want to test.
- **Enter URLs:** Provide valid account URLs for the corresponding products in the "Enter account URL" section, which act as the currentHost during testing.
- **Continue:** Click **Continue**.

### Step 4: App Settings (if applicable)
- **Access URL:** If your app has installation parameters, the App Settings page will open at [http://localhost:10001/custom_configs](http://localhost:10001/custom_configs).
- **Enter Parameters:** Fill in the required values and click **Install**.
- **No Parameters:** If there are no parameters, a message will indicate that the app doesn't have an installation page.

### Step 5: Test Serverless Events
- **Access URL:** Navigate to [http://localhost:10001/web/test](http://localhost:10001/web/test).
- **Select Options:** Choose the module and event to test from the drop-down menus.
- **Review Payload:** Examine the event payload.
- **Simulate:** Click **Simulate**.
  - **On Success:** The button changes to "Success" and the payload is added to the test data folder.
  - **On Failure:** The button changes to "Failed", allowing you to modify the payload and retry.

### Step 6: Additional Notes
- **Payload Details:** The test data payloads in `server/test_data` do not include the `currentHost` attribute that is present in actual runtime payloads; during testing, system settings selections serve as the currentHost.
- **Event Options:** Use the drop-down options to test various events including app setup events (`onAppInstall`, `afterAppUpdate`, `onAppUninstall`), external events (`onExternalEvent`), scheduled events (`onScheduledEvent`), and product-specific events.

---
>title: Detailed instructions for testing a global app of type SMI app
>tags: cli, fdk, testing, smi_app, global_app
>context: server.js
>content:

# Detailed instructions for testing a global app of type SMI app

## Summary
1. **Latest Chrome Requirement:** Ensure you have the latest version of Chrome.
2. **Simulated Testing:** Testing simulates events and does not create real data.
3. **Test Data Payloads:** Payloads are stored in `<app's root directory>/server/test_data`.
4. **Run FDK Command:** Execute `fdk run` to start the local test server.
5. **Display Test URLs:** The test URLs for product UI, App Settings, and serverless events are shown.
6. **System Settings:** Configure testing modules and account URLs.
7. **App Settings (if applicable):** Provide installation parameters if needed.
8. **Test Serverless Events:** Simulate serverless events.
9. **Test App Functionality:** Verify app rendering and functionality in the Freshworks product.
10. **Additional Notes:** Understand payload nuances and test various events.
11. **Code Coverage:** Ensure at least 80% code coverage.
12. **Support:** Attach detailed logs for troubleshooting.

## Detailed Steps

### Step 1: Latest Chrome Requirement
- Ensure you have the latest version of Chrome installed.

### Step 2: Simulated Testing
- Testing simulates events and does not create real data. For real data testing, publish your app and test events manually.

### Step 3: Test Data Payloads
- Test data payloads are stored in `<app's root directory>/server/test_data` and are updated when modules are added or events are registered.

### Step 4: Run FDK Command
- **Navigate:** Go to your app's directory in the command line.
- **Execute Command:** Run `fdk run` to start the local test server.
- **Result:** The test URLs for the product UI, App Settings, and serverless events simulation will be displayed.

### Step 5: System Settings
- **Access URL:** Open [http://localhost:10001/system_settings](http://localhost:10001/system_settings) in your browser.
- **Select Modules:** Choose the modules to test.
- **Enter URLs:** Provide valid account URLs for the corresponding products in the "Enter account URL" section.
- **Continue:** Click **Continue**.

### Step 6: App Settings (if applicable)
- **Access URL:** If your app has installation parameters, the App Settings page opens at [http://localhost:10001/custom_configs](http://localhost:10001/custom_configs).
- **Enter Parameters:** Fill in the required values and click **Install**.
- **No Parameters:** If there are no parameters, a message will indicate that the app lacks an installation page.

### Step 7: Test Serverless Events
- **Access URL:** Navigate to [http://localhost:10001/web/test](http://localhost:10001/web/test).
- **Select Options:** Choose the module and event to test from the drop-down menus.
- **Review Payload:** Examine the event payload.
- **Simulate:** Click **Simulate**.
  - **On Success:** The button changes to "Success" and the payload is added to the test data folder.
  - **On Failure:** The button changes to "Failed", allowing you to modify the payload and retry.

### Step 8: Test App Functionality
- **Log In:** Sign in to the Freshworks product account where you want to test the app.
- **Modify URL:** Append `?dev=true` to the default account URL.
- **Verify:** Navigate to the deployed app location, check that it renders correctly, and test its functionality.

### Step 9: Additional Notes
- **Payload Details:** Test data payloads do not include the `currentHost` attribute present in actual runtime payloads; system settings selections serve as the `currentHost`.
- **Event Options:** Use the drop-down options to test various events:
  - App setup: `onAppInstall`, `afterAppUpdate`, `onAppUninstall`
  - External: `onExternalEvent`
  - Scheduled: `onScheduledEvent`
  - Product: Specific product event names.

### Step 10: Code Coverage
- Aim for at least 80% code coverage for successful publication in the Freshworks Marketplace. Refer to "Code coverage" for further details.

### Step 11: Support
- Attach detailed logs to your support ticket at [freshworks platform support](http://freshworksplatforms.freshdesk.com/) for faster troubleshooting if issues occur.

---
