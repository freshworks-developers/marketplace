>title: How to fix STORE_FAILURE error while using custom iparams
>tags: custom-iparams,custom-installation-parameters
>context: app.js, server.js
>code:

# Fixing STORE_FAILURE error while using custom iparams

To store the installation parameter values entered in the installation page, include the postconfigs method in the iparams.html file. The method is triggered when, on the Setting page, Install is clicked. If the postConfigs method hasn't been configured properly, this error could occur. Here is  sample code for using postConfigs:
```js
<script type= "text/javascript">
  function postConfigs() {
    var requester={};
    var deparment = [];
    var conditions = [];
    var api_key = jQuery("input[name=api_key]").val();
    var first_name = jQuery("input[name=first_name]").val();
    var last_name = jQuery("input[name=last_name]").val();
    requester["first_name"] = first_name;
    requester["last_name"] = last_name;
    jQuery("#deparment option:selected").each(function(){
      deparment.push(jQuery(this).val());
    });
    jQuery("input[name="condition"]:checked").each(function(){
    conditions.push(jQuery(this).val());
    });
    return {
      __meta: {
       secure: ["api_key"]
     },
      api_key,
      requester,
      deparment: deparment,
      conditions: conditions
    }
  }
</script>
```

---

>title: How to fix VALIDATION_FAILURE error while using custom iparams
>tags: custom-iparams,custom-installation-parameters
>context: app.js, server.js
>code:

# How to fix VALIDATION_FAILURE error while using custom iparams

validate method is used to validate the custom iparams on the client-side. This error might occur if one or more of the validation conditions are not satisfied. Please ensure that the validation condition is satisified by the input values. Here is sample code using validate method:

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

>title: How to fix 404 error while using custom iparams
>tags: custom-iparams,custom-installation-parameters
>context: app.js, server.js
>code:

# How to fix 404 error while using custom iparams

This error occurs if custom installation page doesn't exist. Please ensure that iparams.html is present to avoid this error. Here is sample code for creating iparams.html:

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="stylesheet" type="text/css" href="https://static.freshdev.io/fdk/2.0/assets/freshworks_crm.css">
    <script src="{{{appclient}}}"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="./assets/iparams.css">
    <script src="./assets/iparams.js"></script>
    <script type= "text/javascript">
      jQuery("#error_div").hide();
      jQuery("#department").select2({
        width: "resolve"
      });
    </script>
    <script type= "text/javascript">
      function postConfigs() {
        var requester = {};
        var department = [];
        var conditions = [];
        var api_key = jQuery("input[name=api_key]").val();
        var first_name = jQuery("input[name=first_name]").val();
        var last_name = jQuery("input[name=last_name]").val();
        requester["first_name"] = first_name;
        requester["last_name"] = last_name;
        jQuery("#department option:selected").each(function(){
          company.push(jQuery(this).val());
        });
        jQuery("input[name=\"condition\"]:checked").each(function(){
        conditions.push(jQuery(this).val());
        });
        return {
          __meta: {
            secure: ["api_key"]
          },
          api_key,
          requester,
          department: company,
          conditions: conditions
        }
      }
    </script>
  </head>
  <body>
    <div class="requester-fields">
      <h3>Requester Fields</h3>
        <label for="api_key">API key</label>
        <input type="text" name="api_key">
        <span id="error_div" class="error" style="display: none;">Please enter a valid input. Please enter only alphabets.</span>
        <label for="first_name">First Name</label>
        <input type="text" name="first_name">
        <label for="last_name">Last Name</label>
        <input type="text" name="last_name">
    </div>
    <div class="account-fields">
      <h3>Department Fields</h3>
      <select class="select2-fields int-select select2-offscreen" data-disable-field="Department" data-placeholder=" " id="department" multiple="multiple" name="company[]" rel="select-choice" tabindex="-1">
        <option value="Department">Department</option>
        <option value="City">City</option>
        <option value="Country">Country</option>
        <option value="Email">Email</option>
        <option value="Phone">Phone</option>
        <option value="PostalCode">Postal Code</option>
        <option value="State">State</option>
      </select>
    </div>
      <label class="checkbox-inline"><input name="condition" type="checkbox" value="order"> Display orders from sample app</label>
      <label class="checkbox-inline"><input name="condition" type="checkbox" value="type"> Display type from sample app</label>
  </body>
</html>
```

---

>title: I am able to submit custom iparams successfully, but the iparams are not getting persisted
>tags: custom-iparams,custom-installation-parameters
>context: app.js, server.js
>code:

#  I am able to submit custom iparams successfully, but the iparams are not getting persisted

postConfigs method is used to persist the values entered in the custom installation page. If postConfigs method is not configured properly, then this error might occur. Here is some sample code that uses postConfigs:

```js
<script type= "text/javascript">
  function postConfigs() {
    var requester={};
    var deparment = [];
    var conditions = [];
    var api_key = jQuery("input[name=api_key]").val();
    var first_name = jQuery("input[name=first_name]").val();
    var last_name = jQuery("input[name=last_name]").val();
    requester["first_name"] = first_name;
    requester["last_name"] = last_name;
    jQuery("#deparment option:selected").each(function(){
      deparment.push(jQuery(this).val());
    });
    jQuery("input[name="condition"]:checked").each(function(){
    conditions.push(jQuery(this).val());
    });
    return {
      __meta: {
       secure: ["api_key"]
     },
      api_key,
      requester,
      deparment: deparment,
      conditions: conditions
    }
  }
</script>
```
---

>title: Why am I unable to find one or more iparams in edit settings page
>tags: custom-iparams,custom-installation-parameters
>context: app.js, server.js
>code:

# Why am I unable to find one or more iparams in edit settings page

getConfigs is used to retrieve installation parameters that are stored using postConfigs. If getConfigs is not used appropriately, then one or more installation parameters might be missing. Here is some sample code using getConfigs:

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

>title: What if iparams.html is missing
>tags: custom-iparams,custom-installation-parameters
>context: app.js, server.js
>code:

# What if iparams.html is missing

Please ensure that iparams.html is present in order to fetch and store custom installation parameters. Here is sample code for creating iparams.html:

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="stylesheet" type="text/css" href="https://static.freshdev.io/fdk/2.0/assets/freshworks_crm.css">
    <script src="{{{appclient}}}"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="./assets/iparams.css">
    <script src="./assets/iparams.js"></script>
    <script type= "text/javascript">
      jQuery("#error_div").hide();
      jQuery("#department").select2({
        width: "resolve"
      });
    </script>
    <script type= "text/javascript">
      function postConfigs() {
        var requester = {};
        var department = [];
        var conditions = [];
        var api_key = jQuery("input[name=api_key]").val();
        var first_name = jQuery("input[name=first_name]").val();
        var last_name = jQuery("input[name=last_name]").val();
        requester["first_name"] = first_name;
        requester["last_name"] = last_name;
        jQuery("#department option:selected").each(function(){
          company.push(jQuery(this).val());
        });
        jQuery("input[name=\"condition\"]:checked").each(function(){
        conditions.push(jQuery(this).val());
        });
        return {
          __meta: {
            secure: ["api_key"]
          },
          api_key,
          requester,
          department: company,
          conditions: conditions
        }
      }
    </script>
  </head>
  <body>
    <div class="requester-fields">
      <h3>Requester Fields</h3>
        <label for="api_key">API key</label>
        <input type="text" name="api_key">
        <span id="error_div" class="error" style="display: none;">Please enter a valid input. Please enter only alphabets.</span>
        <label for="first_name">First Name</label>
        <input type="text" name="first_name">
        <label for="last_name">Last Name</label>
        <input type="text" name="last_name">
    </div>
    <div class="account-fields">
      <h3>Department Fields</h3>
      <select class="select2-fields int-select select2-offscreen" data-disable-field="Department" data-placeholder=" " id="department" multiple="multiple" name="company[]" rel="select-choice" tabindex="-1">
        <option value="Department">Department</option>
        <option value="City">City</option>
        <option value="Country">Country</option>
        <option value="Email">Email</option>
        <option value="Phone">Phone</option>
        <option value="PostalCode">Postal Code</option>
        <option value="State">State</option>
      </select>
    </div>
      <label class="checkbox-inline"><input name="condition" type="checkbox" value="order"> Display orders from sample app</label>
      <label class="checkbox-inline"><input name="condition" type="checkbox" value="type"> Display type from sample app</label>
  </body>
</html>
```

---

>title: Why am I unable to find the crayons core component that I added in the custom installation page
>tags: custom-iparams,custom-installation-parameters
>context: app.js, server.js
>code:

# Why am I unable to find the crayons core component that I added in the custom installation page

Please ensure that you have added the dependency for crayons core library using CDN or node modules, otherwise this issue might occur. Here is an example of the script to be included in iparams.html
```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@freshworks/crayons@v4/dist/crayons/crayons.esm.js"
></script>
<script
  nomodule
  src="https://cdn.jsdelivr.net/npm/@freshworks/crayons@v4/dist/crayons/crayons.js"
></script>
```

---

>title: Why am I unable to use client.data.get() in the custom installation page
>tags: custom-iparams,custom-installation-parameters
>context: app.js, server.js
>code:

# Why am I unable to use client.data.get() in the custom installation page

Unfortunately, in custom iparams you are able to use only the following services such as DB, Request API and SMI. DataAPI is not allowed to use in the iparams and the only workaround is to use the form fields to get from the user. You could try using the following instead to get the domain name:

```js
const domain = (window.location !== window.parent.location) ? document.referrer : document.location.href;
```

---

>title: Unable to use Data Storage feature is inaccessible for the iparams page of a custom app, specifically during the app update process.
>tags: custom-iparams,custom-installation-parameters
>context: app.js, server.js
>content:

# Unable to use Data Storage feature is inaccessible for the iparams page of a custom app, specifically during the app update process.

Data storage feature cannot be accessed in iparams before the app is installed or updated as the necessary app details needed for data storage will not be available in the backend before app install or update. Please handle the app logic accordingly.

---

>title: I facing undefined error for trigger while using client.interface.trigger on my custom iparams page.
>tags: custom-iparams,custom-installation-parameters
>context: app.js, server.js
>content:

# I facing undefined error for trigger while using client.interface.trigger on my custom iparams page.

Since client.interface object is not accessible on iparams.html, this error might be faced. The only features that you can use in iparams.html are request API and Server Method Invocation(SMI). Also, it is not possible to access secure iparams in front-end apps. It's possible only in serverless apps.

---

>title: Why am I facing Uncaught TypeError: Cannot read properties of undefined while using client.request.invokeTemplate method. 
>tags: custom-iparams,custom-installation-parameters
>context: app.js, server.js
>code:

# Why am I facing Uncaught TypeError: Cannot read properties of undefined while using client.request.invokeTemplate method. 

This error might occur if app is not initialized. Please refer to the sample code given below to initialise the app:

```js
let client;
init();
async function init() {
  client = await app.initialized();
}
```

---

>title: Mandatory method call(s) missing in ${HTML_FILE}/${JS_FILE} for custom settings: ${missingCustomSettingsMethods.toString()}
>tags: custom-iparams,custom-installation-parameters
>context: app.js, server.js
>code:

# Mandatory method call(s) missing in ${HTML_FILE}/${JS_FILE} for custom settings: ${missingCustomSettingsMethods.toString()}

getConfigs, postConfigs and validate methods are mandatory in custom iparams. If any of them are missing then, you will face this error. You can find same code for each of them below

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
<script type= "text/javascript">
  function postConfigs() {
    var requester={};
    var deparment = [];
    var conditions = [];
    var api_key = jQuery("input[name=api_key]").val();
    var first_name = jQuery("input[name=first_name]").val();
    var last_name = jQuery("input[name=last_name]").val();
    requester["first_name"] = first_name;
    requester["last_name"] = last_name;
    jQuery("#deparment option:selected").each(function(){
      deparment.push(jQuery(this).val());
    });
    jQuery("input[name="condition"]:checked").each(function(){
    conditions.push(jQuery(this).val());
    });
    return {
      __meta: {
       secure: ["api_key"]
     },
      api_key,
      requester,
      deparment: deparment,
      conditions: conditions
    }
  }
</script>
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

>title: How to reference iparams in app.js
>tags: custom-iparams,custom-installation-parameters
>context: app.js, server.js
>content:

# How to reference iparams in app.js

In Freshworks apps, client.iparams.get(iparam_key) is a method that returns the value of an iparam based on its key. The method identifies the iparam by its key. It returns the value associated with the iparam. If you try to retrieve a secure iparam, an error message will appear.

---
