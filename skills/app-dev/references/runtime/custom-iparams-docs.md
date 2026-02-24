>title: What is the Settings page and installation parameters in Freshworks apps
>tags: custom-iparams, usage
>context: 
>content:

# What is the Settings page and installation parameters in Freshworks apps

Your app typically requires, from the app’s user, certain data that is necessary to process the app logic. It might not be possible to include this data in your app code due to reasons such as - exposinging secure information or simply the unavailability of the data with you during app building. At times, your app can also be user-scoped - meaning, it can work based on the user’s needs. To do this, it is essential for the app to retrieve user-input data and at times, persist the data. 

The developer platform enables you to configure either a default Settings page or a custom Settings page to collect data from the app user. Installation params or iparams are parameters whose values app users can set when they install an app. These parameters are presented to the app users through the Settings page.

---
>title: What are custom iparams in Freshworks apps
>tags: custom-iparams, usage
>context: 
>content:

# What are custom iparams in Freshworks apps

Installation params or iparams are parameters whose values app users can set when they install an app. These parameters are presented to the app users through the Settings page. If you prefer to build the interface of your Settings page, you can build a custom page with custom iparams. The custom page can
1. contain elements such as nested fields, toggles, sliders, date and time pickers, mappers, and so on.
2. be rendered differently for the different modules on which an app is deployed.
3. be dynamic and perform client-side validation of the input iparams’ values.

---

>title: How should I choose between iparams and custom iparams in my Freshworks apps
>tags: custom-iparams, iparams
>context: 
>content:

# How should I choose between iparams and custom iparams in my Freshworks apps

Custom iparams are useful if you prefer to build your own settings page. We've listed a few considerations below :
1. Would you like to customize the elements on settings page based on your preferences?
2. Does your app have any fields that require custom validations?
3. Are you comfortable with writing code in html, css and javascript?

If the answer is yes, to more than one of the above questions then custom iparams might be a good fit for your use case. However, if you are looking for the standard template for Settings page, then using iparams can help you get a headstart.

---

>title: How to create a custom settings page in my Freshworks apps
>tags: custom-iparams, how-to
>context: 
>content:

# How to create a custom settings page in my Freshworks apps

To create and use a custom Settings page:

1. Create the iparams.html file to render the user interface of the custom installation page. In the iparams.html file, include the reference to all required assets such as HTML, CSS, and JavaScript (JS) files.
2.Create the config/assets/iparams.js file.
3. To render module-specific custom installation page, in iparams.js:
    a. Use the app.initialized() method to initialize the app and retrieve the client reference.
    b. Use the client.data.get(currentHost) method, to retrieve the list of modules the app user has subscribed to.
    c. Implement module-specific hide/show logic to render components on the custom installation page.
4. In the iparams.js file, add the postConfigs method to retrieve the iparams as form fields with values and store them.
    a. Use the meta tag to map iparams to modules, when the iparams are stored.
    b. Use the meta tag to declare certain iparams as secure iparams.
5. In the iparams.js file, add the getConfigs method to retrieve the stored iparams’ values alone and populate the Edit Settings page.
6. To perform client-side validation of the iparams entered, in the iparams.js file, add the validate method.
7. Retrieve the stored iparams and use them in apps.

---

>title: How to create the html file for custom iparams
>tags: custom-iparams, how-to
>context: iparams.html
>code:

# How to create the html file for custom iparams

Given below are the steps involved in creating the html file for custom iparams:
1. Navigate to the config directory and create an iparams.html file. Ensure that the config directory contains only one of the two files - iparams.json or iparams.html.
2. In the iparams.html file: 
    a. Include the required HTML, CSS, and JS dependencies. By default, when you use the generate command and generate the iparams.html file, the freshworks css (https://static.freshdev.io/fdk/2.0/assets/freshworks.css) is included in the file.
    b. Include the appclient through <script src="{{{appclient}}}"></script>
    c. Include the logic to render the installation page UI components.
3. Navigate to the config directory and create the assets folder.
4. In the assets folder, create all necessary .css and .js files that are declared as dependencies in iparams.html. You can add external assets, such as .css and .js, in the config/assets folder to render the custom installation (Settings) page, validate the iparams’ values, store and retrieve the iparams.
Here is a sample iparams.html file :
```html
<html>
  <head>
    <title>Installation Page</title>
    <link rel="stylesheet" type="text/css" href="./assets/iparams.css">
    <script defer src="{{{appclient}}}"></script>
  </head>
  <body>
    <div class='form'>
      <form>
        <fw-select class="group-field" label="Group" hint-text="ENTER GROUP" multiple
          placeholder="Choose options">
          <fw-select-option value="opt1">Opt1</fw-select-option>
          <fw-select-option value="opt2">Opt2</fw-select-option>
          <fw-select-option value="opt3">Opt3</fw-select-option>
        </fw-select>
        <fw-input class="email-field" type="email" label="Email" required></fw-input>
        <br>
        <fw-checkbox class="dark-mode-field">Dark Mode</fw-checkbox><br><br>
      </form>
    </div>
    <script defer src="./assets/iparams.js"></script>
  </body>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@freshworks/crayons@v4/dist/crayons/crayons.esm.js"></script>
  <script nomodule src="https://cdn.jsdelivr.net/npm/@freshworks/crayons@v4/dist/crayons/crayons.js"></script>
</html>
```

---

>title: How to render module-specific installation page while building global apps
>tags: custom-iparams, how-to
>context: iparams.html
>code:

# How to render module-specific installation page while building global apps

A global app can be built to work across multiple modules. You can build your custom installation page such that the installation page shows iparam fields that are relevant to a module. To do this:

1. Navigate to the config/assets/iparams.js file.
2. Use the app.initialized() method as shown below. App initialization occurs when the parent application (the product on which the app is deployed) is loaded for the first time. If app initialization is successful, the parent application (the product on which the app is deployed) passes a client reference to the app.
3. Use the client reference to run the client.data.get(currentHost) method. This retrieves the list of modules the app user has subscribed to.
The sample code shown below implements module-specific hide or show logic for the installation page components.

```js
async function init() {
  let modules = await subscribed_modules;
  if (modules.includes("support_ticket") || modules.includes("deal")) {
    fields.hide("email-field");
  }

  if (modules.includes("service_ticket")) {
    fields.hide("group-field");
  }
}

async function getSubscribedModules() {
  let client = await app.initialized();
  let data = await client.data.get("currentHost");
  subscribed_modules = await data.currentHost.subscribed_modules;
  return subscribed_modules;
}
```

---

>title: When to use postConfigs
>tags: custom-iparams, how-to
>context: iparams.html
>code:

# When to use postConfigs

To store the installation parameter values entered in the custom installation page, include the postconfigs method in the iparams.js file. The method is triggered when, on the custom installation (Settings) page, Install is clicked. The method stores the iparams and corresponding values entered in the custom installation (Settings) page, as JSON key-value pairs.
Here is some sample code for using postConfigs:
```js
function postConfigs() {
  return {
    __meta: {
      secure: ["password"],
      modules: {
        support_ticket: ["groups"],
        deal: ["groups"],
        service_ticket: ["email", "password"],
      },
    },
    groups: groupField.value,
    email: emailField.value,
    password: passwordField.value
    dark_mode: darkModeField.checked,
  };
  ```

---

>title: How to declare secure iparams
>tags: custom-iparams, how-to
>context: iparams.html
>code:

# How to declare secure iparams

 Some iparams are used to collect sensitive data, which has to be protected from exposure through the app’s front-end components. Use the sample code on the given below, to declare an iparam as a secure iparam. When using the secure iparam values entered in the custom installation (Settings) page, use the Request method. Please note that
 1. To mark nested objects as secure, you can add the iparams as objects in the nested JSON.
 2. Secure iparams cannot be accessed in the front-end component of the app; attempting to do so will result in an undefined error.
 Here is a sample postConfigs code for storing secure nested iparams:
 ```js
 function postConfigs() {
 return {
   __meta: {
     secure: [oneLevelNested, oneLevelNestedDot.key, multiLevel["default"].key]
   },
   oneLevelNested: {
     "key": "value"
   },
   oneLevelNestedDot:{
     "key": {
       "test": "value"
     }
   },
   multiLevel: {
     "default": {
       "key": "value",
       "token": "value"
     }
   }
 };
};
 ```

---

>title: How to map iparams to modules in global apps
>tags: custom-iparams, how-to
>context: iparams.html
>code:

# How to map iparams to modules in global apps

You can map the custom iparams that you create with the modules registered in the App Manifest. The iparams become applicable only to the mapped modules. Use the sample code, to know how to map iparams to modules. The iparams’ values configured for an app during installation can be edited by loading them onto the Edit Settings page. When loaded, if an iparam is mapped to a module, the iparam is displayed on the page only if the module is a valid module of the product where the app is installed.
1. If an iparam is not mapped to a module, it is displayed for all the modules.
2. This mapping is used only when the iparam is populated for editing. For initially displaying or hiding the iparams on the Installation page, use the procedure in the Render module-specific installation.
Here is a sample code snippet that maps custom iparams to specific modules:

```js
function postConfigs() {
  return {
    __meta: {
      secure: ["password"],
      modules: {
        support_ticket: ["groups"],
        deal: ["groups"],
        service_ticket: ["email", "password"],
      },
    },
    groups: groupField.value,
    email: emailField.value,
    password: passwordField.value
    dark_mode: darkModeField.checked,
  };
```

---

>title: How to use getConfigs to retrieve custom iparams
>tags: custom-iparams, how-to
>context: iparams.html
>code:

# How to use getConfigs to retrieve custom iparams

To retrieve the stored iparams’ values and populate them on the Edit Settings page, include the getconfigs method in the iparams.js file. The method is triggered when you click the Settings menu button on the Manage Apps page > Installed Apps tab. If an iparams - module(s) mapping exists, only the iparams relevant to the product (modules) on which the app is installed, are retrieved and populated in the Edit Settings page.
Here is a sample code snippet that uses getConfigs:

```js
function getConfigs(configs) {
  groupField.value = configs.groups;
  emailField.value = configs.email;
  darkModeField.value = configs.dark_mode;
}
```

---

>title: How to validate values entered on the Settings page or the Edit settings page
>tags: custom-iparams, how-to
>context: iparams.html
>code:

# How to use getConfigs to retrieve custom iparams

To validate the values entered on the Settings page or the Edit settings page, use the sample code on the right pane and include this method in the iparams.js file. The method is triggered when:
1. During installation, users enter iparam values and click Install on the Installation page.
2. After installation, users edit iparam values on the Edit Settings page.
If the method returns false, the installation is stopped or the iparam values are not saved.
```js
function validate() {
 let isValid = true;
 var input = jQuery("input[name=last_name]").val();
  if(!input.match(/^[A-z]+$/)) {
    jQuery("#error_div").show();
    isValid = false;
  }
  else {
    jQuery("#error_div").hide();
  }
 return isValid;
}
```

---

>title: How to test the configured custom installation parameters
>tags: custom-iparams, how-to
>context: iparams.html
>content:

# How to test the configured custom installation parameters

Given below are the steps involved in testing the configured custom installation parameters:
1. From the command line, navigate to the directory that contains the app related files and run the fdk run command. The FDK starts the local test server. The test URLs to access the product UI, the App Settings page (or Custom installation page), and the URL to the serverless events simulation page are displayed.
2. Navigate to the system settings page at http://localhost:10001/system_settings. All modules configured in the App manifest are listed.
3. In the system settings page,
    a. Select the modules for which you want to test the app logic. The Enter account URL section is displayed, with a prompt to enter the account URLs for all selected modules.
    b. In the Enter account URL section, enter valid account URL(s) for the product(s) to which the selected modules belong. During app testing, this URL plays the role of the currentHost. Based on the currentHost, the currentHost.subscribed_modules and currentHost.endpoint_urls are determined.
    c. Click Continue.
4. If you have configured installation parameters for the app, the App Settings page is displayed at http://localhost:10001/custom_configs. Enter appropriate values for the installation parameters and click Install. If you have not configured any installation parameters, a page is displayed with information on the configured system settings. A message stating that the app does not have an installation page is displayed.
5. To reselect modules or reenter account URLs, on the App Settings page, click Back.

---

>title: Is custom iparam storage secure?
>tags: custom-iparams, how-to
>context: iparams.html
>content:

# Is custom iparam storage secure?

Rest assured, your iparams values are securely stored on Freshdesk servers. They are only accessible to your app’s backend code, minimizing any potential security risks when used properly. Your sensitive data is well-protected.

---

>title: How to validate custom iparams using request method?
>tags: custom-iparams, how-to
>context: iparams.html
>code:

# How to validate custom iparams using request method?

On the Custom Installation Page, one can use Request Method to validate authentication credentials like API keys for Freshworks products and any third-party services. The methodology is similar to how it would be done in a web application. Here, the platform’s Request Method comes to the rescue of making API without needing a third-party library.

The API is made in the browser, and all the details will be visible in the browser developer tools. This shows how authentication credentials can be validated on the custom installation page.

## Let’s see an example code for the Request Method validation in the iparams.html.

1. We have input fields for the Freshdesk domain and Freshdesk API key. For example, we are using Freshdesk credentials. But any third-party validations that use similar authentication schemes.
2. The Freshworks Crayons components are used for input fields and buttons. Thus, the same UI component library is imported via CDN URL.

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script
    src="https://static.freshdev.io/fdk/2.0/assets/fresh_client.js"></script>
  <link rel="stylesheet" href="./assets/iparams.css" />
</head>

<body>
  <main>
    <h3>
      Configuration page built using
      <code>iparams.html</code>
    </h3>

    <fw-input required="true" type="text" icon-left="items" label="domain"
      size="30" placeholder="subdomain.freshdesk.com" class="domain"></fw-input>

    <fw-input label="Freshdesk API Key" icon-right="magic-wand"
      placeholder="Freshdesk API Key" required="true"
      minlength="5" size="30" class="secure-field"></fw-input>

    <fw-button color="primary" id="btnVerify">Verify</fw-button>

  </main>

  <script src="./assets/iparams.js"></script>
  <script type="module"
    src="https://unpkg.com/@freshworks/crayons@v4/dist/crayons/crayons.esm.js"></script>
  <script nomodule
    src="https://unpkg.com/@freshworks/crayons@v4/dist/crayons/crayons.js"></script>
</body>

</html>
```

## iparams.js can be defined as follows:

1. The validate, getConfigs, and postConfigs functions are mandatory by the platform and work in a certain way. Refer to the documentation for their detailed functionality and why they are mandatory on the custom installation page.
2. After the page is loaded, the button click event listener is added for the fwClick button component.
3. The verify function has the validation functionality by making an API with the given Freshdesk domain and API key to a GET API. If the API succeeds, the given inputs are valid and not otherwise.
4. The validate function will return true or false based on the API’s success or failure.

```js
const apiKey = document.querySelector('.secure-field');
const domain = document.querySelector('.domain');
const btnVerify = document.querySelector('#btnVerify');

function postConfigs() {
  return {
    __meta: {
      secure: ['apiKey']
    },
    api_key: apiKey.value,
    domain_url: domain.value
  };
}

function getConfigs(configs) {
  let { api_key, domain_url } = configs;
  apiKey.value = api_key;
  domain.value = domain_url;
  return;
}

let verified = false;
async function verify() {
  try {
    const res = await client.request.invokeTemplate('verify_domain_api', {});

    if (res.status === 200) {
      verified = true;
      client.interface.triggerNotify('Credentials verified!', { type: 'success' });
    } else if (res.status === 401) {
      verified = false;
      client.interface.triggerNotify('Invalid domain or API key', { type: 'error' });
    } else {
      verified = false;
      client.interface.triggerNotify(`Unexpected status: ${res.status}`, { type: 'error' });
    }
  }
  catch (err) {
    verified = false;
    console.error('Error during verification while validating API credentials:', err);
    client.interface.triggerNotify('Validation failed', { type: 'error' });
  }
}

async function validate() {
  return verified;
}

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();
  async function renderApp() {
    try {
      let client = await app.initialized();
      window.client = client;

      btnVerify.addEventListener('fwClick', verify);
    } catch (error) {
      return console.error(error);
    }
  }
};
```

## Declare the request in manifest.json

```json
{
  "requests": {
    "verify_domain_api": {}
  }
}
```

## Define request in config/requests.json

```json
{
  "verify_domain_api": {
    "schema": {
      "method": "GET",
      "host": "<%= iparam.domain_url %>",
      "path": "/api/v2/tickets",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>",
        "Content-Type": "application/json"
      }
    }
  }
}



---

>title: How to validate custom iparams using request method?
>tags: custom-iparams, how-to
>context: iparams.html
>code:

# How to build an custom iparam page requesting for user's information

To create the custom iparam page, you would need to create iparams.html. The sample code for iparams.html has been shared below. 
```html
<html>
  <head>
    <title>Installation Page</title>
    <link rel="stylesheet" type="text/css" href="./assets/iparams.css">
    <script defer src="{{{appclient}}}"></script>
  </head>
  <body>
    <div class='form'>
      <form>
        <fw-select class="group-field" label="Group" hint-text="ENTER GROUP" multiple
          placeholder="Choose options">
          <fw-select-option value="opt1">Opt1</fw-select-option>
          <fw-select-option value="opt2">Opt2</fw-select-option>
          <fw-select-option value="opt3">Opt3</fw-select-option>
        </fw-select>
        <fw-input class="email-field" type="email" label="Email" required></fw-input>
         <fw-input class="password" type="password" label="password" required></fw-input>
        <br>
        <fw-checkbox class="dark-mode-field">Dark Mode</fw-checkbox><br><br>
      </form>
    </div>
    <script defer src="./assets/iparams.js"></script>
  </body>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@freshworks/crayons@v4/dist/crayons/crayons.esm.js"></script>
  <script nomodule src="https://cdn.jsdelivr.net/npm/@freshworks/crayons@v4/dist/crayons/crayons.js"></script>
</html>
```
To store the installation parameter values entered in the custom installation page, include the postconfigs method in the iparams.js file. 
```js
function postConfigs() {
  return {
    __meta: {
      secure: ["password"],
      modules: {
        support_ticket: ["groups"],
        deal: ["groups"],
        service_ticket: ["email", "password"],
      },
    },
    groups: groupField.value,
    email: emailField.value,
    password: passwordField.value
    dark_mode: darkModeField.checked,
  };
```
To retrieve the stored iparams’ values and populate them on the Edit Settings page, include the getconfigs method in the iparams.js file.
```js
function getConfigs(configs) {
  groupField.value = configs.groups;
  emailField.value = configs.email;
  darkModeField.value = configs.dark_mode;
}
```
---

>title: I have a question about custom iparams.html. I want to be able to check if input values are valid and save if they are. If not, I want to display an error message.
>tags: custom-iparams, how-to
>context: iparams.js
>code:

# I have a question about custom iparams.html. I want to be able to check if input values are valid and save if they are. If not, I want to display an error message.

To validate the values entered on the Settings page or the Edit settings page, use the sample code on the right pane and include this method in the iparams.js file. The method is triggered when:

1. During installation, users enter iparam values and click Install on the Installation page.
2. After installation, users edit iparam values on the Edit Settings page.
If the method returns false, the installation is stopped or the iparam values are not saved.

```js
function validate() {
 let isValid = true;
 var input = jQuery("input[name=last_name]").val();
  if(!input.match(/^[A-z]+$/)) {
    jQuery("#error_div").show();
    isValid = false;
  }
  else {
    jQuery("#error_div").hide();
  }
 return isValid;
}
```
---

>title: When creating a iparams.html, would saved variables automatically load in the installed apps tab later
>tags: custom-iparams, how-to
>context: iparams.js
>code:

# When creating a iparams.html, would saved variables automatically load in the installed apps tab later

No, the values saved from custom installation page will not be displayed automatically later. They need to be retrieved using getConfigs method.  To retrieve the stored iparams’ values and populate them on the Edit Settings page, include the getconfigs method in the iparams.html file. The method is triggered when you click the Settings menu button on the Manage Apps page > Installed Apps tab.
Here is some sample javascript code for getConfigs:

```js
<script type= "text/javascript">
function getConfigs(configs) {
 jQuery("input[name=first_name]").val(configs["first_name"]);
 jQuery("input[name=last_name]").val(configs["last_name"]);
 for(var i= 0; i < configs.department.length; i++ ) {
   jQuery("#department option[value=" + configs.department[i] + "]").attr("selected",true);
  }
  jQuery("#department").select2();
  if(configs.conditions) {
     jQuery("input[name="condition"]").attr("checked",false);
     for(var a= 0; a < configs.conditions.length; a++ ) {
       jQuery("input[name="condition"][value="+ configs.conditions[a]+"]").attr("checked",true);
     }
   }
}
</script>
```
---

>title: When would a developer need to access subscribed modules
>tags: custom-iparams, how-to
>context: iparams.js
>content:

# When would a developer need to access subscribed modules

A developer would need to access subscribed modules in order to render module specific content on the custom app. For instance, a developer may want to render a custom app only on the tickets detail page in FreshDesk only if the user subscribes to it. So, they would need to access subscribed modules and check if support_ticket is present. If support_ticket is present, the app will be displayed. This can be handled in the app logic accordingly.

---
