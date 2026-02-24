>title: What is the interface method? What are the common interface actions that an app can perform
>tags: interface-method
>context: app.js
>content:

# What is the interface method? What are the common interface actions that an app can perform

Interface-methods is a mechanism that the developer platform provides, to enable your app to trigger certain actions on the Freshdesk UI. Using interface methods an app can, on the Freshdesk UI :
1. Display certain UI elements such as Modals, Dialog boxes, Confirmation boxes, and Notifications.
2. Mimic click actions - such as starting or stopping a timer or navigating to specific pages.
3. Show/Hide certain fields, field values, and elements (such as icons or other relevant information).
4. Enable/Disable certain buttons.
5. Set the values of certain fields.

---

>title: What interfaces can an app display/hide on the product UI
>tags: interface-method
>context: app.js
>content:

# What interfaces can an app display/hide on the product UI

The following interfaces can be displayed/hidden on the product UI:
1. Display modals or dialog boxes - showModal method and showDialog method
2. Display confirmation messages - showConfirm method
3. Display notifications - showNotify method
4. Display or hide CTI dialler
5. Display or hide missed calls in the CTI widget
If you have any specific questions regarding any of the following interfaces, feel free to ask.

---

>title: What are the click actions on the product UI an app can mimic
>tags: interface-method
>context: app.js
>content:

# What are the click actions on the product UI an app can mimic

The following are the click actions on the product UI an app can mimic
1. Open Ticket Details page
2. Open Contact Details page
3. Close modals or dialog boxes (Instance method)
If you have any specific questions regarding any of the following interfaces, feel free to ask.

---

>title: How to display modals or dialog boxes
>tags: interface-method
>context: app.js
>code:

# How to display modals or dialog boxes

1. From your project’s root, navigate to the app directory and create a <modal or dialog or any-reasonable-name>.html file. In this file, enter the code to render the (front-end of the) Modal or Dialog box.
2. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (the product on which the app is deployed) passes a client reference to the app.
3. After app initialization, to display a Modal or Dialog box, use the following method:
```js
client.interface.trigger("<method-name>", {
  title: "<Dialog box name>",
  template: "<path to the dialog.html file>"
})
```
<method-name> is showModal or showDialog based on the use case

Considerations while using display modals or dialog boxes
1. title is optional. Max characters: 30; value is truncated beyond 30. Default value: Modal dialog.
2. template is mandatory. Specify the path to the HTML file where the code to render the modal’s front-end is present. If no value is specified, an error message is displayed at run time.

---

>title: When should I use showModal
>tags: interface-method
>context: app.js
>code:

# When should I use showModal

The method displays a Modal in an IFrame. Events methods and Interface methods are not supported in a Modal - your app cannot react to click, change, or update events that occur inside a Modal and your app cannot trigger actions on the product UI from the Modal. Installation parameters, Request method, Data method, and Data storage are supported in modals. If your app uses these methods from modals, in the modal.html file (or in any other equivalent file that you have added), ensure to include the following appclient resource.
```js
<script src="{{{appclient}}}"></script>
```
Here is sample code to display the modal interface :
```js
try {
  let data = client.interface.trigger('showModal', {
  title: 'Sample App Form',
  backdrop: true,
  template: './views/modal.html' });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```
You can retrieve the contextual information pertaining to the parent location from where a modal is triggered by using Instance method - Context. You can use the Instance methods - Send and Receive to enable communication between modals and any other app instance.
Considerations while using display modals or dialog boxes
1. title is optional. Max characters: 30; value is truncated beyond 30. Default value: Modal dialog.
2. template is mandatory. Specify the path to the HTML file where the code to render the modal’s front-end is present. If no value is specified, an error message is displayed at run time.

---

>title: How to display modals without background
>tags: interface-method
>context: app.js
>code:

# How to display modals without background

The modal without backdrop is a beta feature and not available for all Freshdesk accounts. 

## Sample code to create a default modal without backdrop:
```js
try {
  let data = client.interface.trigger('showModal', {
  title: 'Sample App Form',
  nobackdrop: true,
  template: './views/modal.html' });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```
Considerations while creating a modal without a background
1. nobackdrop is optional. To display a modal without a backdrop, specify the nobackdrop attribute value as true. A modal with a backdrop is displayed if no value is specified for the nobackdrop attribute or if the value is specified as false. The modal without backdrop is only supported for the ticket_sidebar, ticket_requester_info, ticket_top_navigation placeholders.
2. The modal without backdrop can also be customised with background colors and linked texts. For the displaying linked text in the modal, both linkText and linkUrl attributes should be defined.
3. You can retrieve the contextual information pertaining to the parent location from where a modal is triggered by using Instance method - Context. You can use the Instance methods - Send and Receive to enable communication between modals and any other app instance.


---

>title: How to display modals with linked text
>tags: interface-method
>context: app.js
>code:

# Sample code to create a modal with linked text
```js
try {
  let data = client.interface.trigger('showModal', {
  title: 'Sample App Form',
  nobackdrop: true,
  linkText: 'Google',
  linkUrl: 'https://google.com',

  template: './views/modal.html' });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```
Considerations while creating a modal without a background
1. nobackdrop is optional. To display a modal without a backdrop, specify the nobackdrop attribute value as true. A modal with a backdrop is displayed if no value is specified for the nobackdrop attribute or if the value is specified as false. The modal without backdrop is only supported for the ticket_sidebar, ticket_requester_info, ticket_top_navigation placeholders.
2. The modal without backdrop can also be customised with background colors and linked texts. For the displaying linked text in the modal, both linkText and linkUrl attributes should be defined.
3. You can retrieve the contextual information pertaining to the parent location from where a modal is triggered by using Instance method - Context. You can use the Instance methods - Send and Receive to enable communication between modals and any other app instance.

---

>title: How to display modals with background colour
>tags: interface-method
>context: app.js
>code:

# Sample code to create a modal with background color
```js
try {
  let data = client.interface.trigger('showModal', {
  title: 'Sample App Form',
  nobackdrop: true,
  bgColor: 'rgb(255, 236, 240)',
  template: './views/modal.html' });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

Considerations while creating a modal without a background
1. nobackdrop is optional. To display a modal without a backdrop, specify the nobackdrop attribute value as true. A modal with a backdrop is displayed if no value is specified for the nobackdrop attribute or if the value is specified as false. The modal without backdrop is only supported for the ticket_sidebar, ticket_requester_info, ticket_top_navigation placeholders.
2. The modal without backdrop can also be customised with background colors and linked texts. For the displaying linked text in the modal, both linkText and linkUrl attributes should be defined.
3. You can retrieve the contextual information pertaining to the parent location from where a modal is triggered by using Instance method - Context. You can use the Instance methods - Send and Receive to enable communication between modals and any other app instance.

---

>title: How to use showDialog method interface
>tags: interface-method
>context: app.js
>content:

# How to use showDialog method interface

The method displays a Dialog box in an IFrame. Events methods and Interface methods are not supported in a Dialog box - your app cannot react to click, change, or update front-end events that occur inside a Dialog box and your app cannot trigger actions on the product UI from the Dialog box. Installation parameters, Request method, Data method, and Data storage are supported in modals. If your app uses these methods from modals, in the dialog.html file (or in any other equivalent file that you have added), ensure to include the following appclient resource.
```js
<script src="{{{appclient}}}"></script>
```
Use the sample code shown below to enable your app to display a Dialog box, as part of the app logic.
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
You can retrieve the contextual information pertaining to the parent location from where a Dialog box is triggered by using Instance method - Context. You can use the Instance methods - Send and Receive to enable communication between modals and any other app instance.

Considerations while using showDialog method
1. title is optional. Max characters: 30; value is truncated beyond 30.
2. template is mandatory. Specify the path to the HTML file where the code to render the Dialog box is present. If no value is specified, an error message is displayed at run time.

---

>title: How to display confirmation messages using interface method
>tags: interface-method
>context: app.js
>code:

# How to display confirmation messages using interface method

To enable your app to display standard confirmation-message boxes,

1. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (the product on which the app is deployed) passes a client reference to the app.
2. After app initialization, to display a confirmation message with default buttons, use the following method:
```js
 client.interface.trigger("showConfirm", {
   title: "<Confirmation box name>",
   message: "<text message to be displayed seeking confirmation>"
 })
```

---

>title: How to use showConfirm method in freshworks app
>tags: interface-method
>context: app.js
>code:

# How to use showConfirm method in freshworks app
The method displays a confirmation message box with a title, a message, and the save and cancel buttons. By default, the message box displays the SAVE and CANCEL buttons. You can customize the button names. Time-out information:Timeout for Confirmation message box is 10 seconds.
Use the sample code shown on the below to enable your app to display a Confirmation message box (with SAVE and CANCEL buttons), as part of the app logic.
```js
try {
  let result = await client.interface.trigger("showConfirm", {
    title: "Confim", // plain text
    message: "Are you sure you want to save the details?" // plain text
  });
  console.log(result);
    /* "result" will be either "Save" or "Cancel" */
} catch (error) {
    // failure operation
  console.error(error);
}
```

---

>title: How to use default button in freshworks app
>tags: interface-method
>context: app.js
>code:

```js
try {
  let result = await client.interface.trigger("showConfirm", {
    title: "Confim", // plain text
    message: "Are you sure you want to save the details?" // plain text
  });
  console.log(result);
    /* "result" will be either "Save" or "Cancel" */
} catch (error) {
    // failure operation
  console.error(error);
}
```

---

>title: How to use custom button in freshworks app
>tags: interface-method
>context: app.js
>code:

```js
try {
  let result = await client.interface.trigger("showConfirm", {
    title: "Confim", // plain text
    message: "Do you want to save the changes?",
    saveLabel: "Save",
    cancelLabel: "Ignore"
  });
  console.log(result);
    /* "result" will be either "Save" or "Ignore" */
} catch (error) {
    // failure operation
    console.error(error);
}
```
### Considerations while using showConfirm method
1. title is optional. Max characters: 30; value is truncated beyond 30.
2. message is mandatory. Max characters: 100; value is truncated beyond 100. If no value is specified, an error message is displayed at run time.
3. saveLabel and cancelLabel are optional. Max characters: 11

---

>title: How to use display notifications in freshworks app
>tags: interface-method
>context: app.js
>code:

# How to use display notifications in freshworks app

To enable your app to display notifications,
1. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (the product on which the app is deployed) passes a client reference to the app.
2. After app initialization, to display a notification, use the following method:
```js
 client.interface.trigger("showNotify", {
   type: “<Possible values: info, success, warning, danger, alert>”,
   title: "<Display name>",
   message: "<text message to be displayed in the notification box>"
 }
)
```
The method displays a notification box with a title and notification message (can be an info message, a success message, a cautionary note, a warning message, or a critical message which, if ignored, can fail the system). Use the sample code shown below to enable your app to display various notification messages, as part of the app logic.

---

>title: How to display an info notification in freshworks app
>tags: interface-method
>context: app.js
>code:

# How to display an info notification in freshworks app
```js
try {
  let data = await client.interface.trigger("showNotify", {
    type: "info",
    title: "Notice!!",
    message: "Notice!! This ticket has been escalated."
    /* The "message" should be plain text */
  });
    console.log(data); // success message
} catch (error) {
    // failure operation
    console.error(error);
}
``` 
## Considerations while displaying notifications
1. type is mandatory. Possible values: info, success, warning, danger, alert. If an incorrect value is entered or if no value is specified, an error message is displayed at run time.
2. title is optional. Max characters: 30; value is truncated beyond 30.
3. message is mandatory. Max characters: 100; value is truncated beyond 100. If no value is specified, an error message is displayed at run time.

---

>title: How to display an success notification in freshworks app
>tags: interface-method
>context: app.js
>code:

# How to display an success notification in freshworks app
```js
try {
  let data = await client.interface.trigger("showNotify", {
    type: "success",
    title: "Success!!", /* The "title" should be plain text */
    message: "The ticket properties has been updated." /* The "message" should be plain text */
  });
    console.log(data); // success message
} catch (error) {
    // failure operation
    console.error(error);
}
```
## Considerations while displaying notifications
1. type is mandatory. Possible values: info, success, warning, danger, alert. If an incorrect value is entered or if no value is specified, an error message is displayed at run time.
2. title is optional. Max characters: 30; value is truncated beyond 30.
3. message is mandatory. Max characters: 100; value is truncated beyond 100. If no value is specified, an error message is displayed at run time.

---

>title: How to display an warning notification in freshworks app
>tags: interface-method
>context: app.js
>code:

# How to display an warning notification in freshworks app
```js
try {
  let data = await client.interface.trigger("showNotify", {
    type: "warning",
    title: "Warning!!",
    message: "The first response is overdue."
      /* The "message" should be plain text */
  });
    console.log(data); // success messag
} catch (error) {
    // failure operation
    console.error(error);
}
```
## Considerations while displaying notifications
1. type is mandatory. Possible values: info, success, warning, danger, alert. If an incorrect value is entered or if no value is specified, an error message is displayed at run time.
2. title is optional. Max characters: 30; value is truncated beyond 30.
3. message is mandatory. Max characters: 100; value is truncated beyond 100. If no value is specified, an error message is displayed at run time.


---

>title: How to display a danger notification in freshworks app
>tags: interface-method
>context: app.js
>code:

# How to display a danger notification in freshworks app
```js
try {
  let data = await client.interface.trigger("showNotify", {
    type: "danger",
    title: "Danger!!",
    message: "This is a sample danger notification."
      /* The "message" should be plain text */
    });
    console.log(data); // success message
} catch (error) {
      // failure operation
    console.error(error);
}
```
## Considerations while displaying notifications
1. type is mandatory. Possible values: info, success, warning, danger, alert. If an incorrect value is entered or if no value is specified, an error message is displayed at run time.
2. title is optional. Max characters: 30; value is truncated beyond 30.
3. message is mandatory. Max characters: 100; value is truncated beyond 100. If no value is specified, an error message is displayed at run time.

---

>title: How to display an danger notification in freshworks app
>tags: interface-method
>context: app.js
>code:

# How to display an alert notification in freshworks app

```js
try {
  let data = await client.interface.trigger("showNotify", {
    type: "alert",
    title: "Alert!!",
    message: "This is a sample alert notification."
      /* The "message" should be plain text */
    });
    console.log(data); // success message
} catch (error) {
      // failure operation
    console.error(error);
}
```
## Considerations while displaying notifications
1. type is mandatory. Possible values: info, success, warning, danger, alert. If an incorrect value is entered or if no value is specified, an error message is displayed at run time.
2. title is optional. Max characters: 30; value is truncated beyond 30.
3. message is mandatory. Max characters: 100; value is truncated beyond 100. If no value is specified, an error message is displayed at run time.

---

>title: Open ticket or contact details page using interfaces in Freshworks app
>tags: interface-method
>context: app.js
>code:

# Open ticket or contact details page using interfaces in Freshworks app

To enable your app to open the ticket or contact details pages, Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (product on which the app is deployed) passes a client reference to the app. After app initialization, to open specific pages, use the following method:

```js
client.interface.trigger("click", {
  id: "<ticket or contact>",
  value: <id of the ticket to be opened>
})
```
id: “ticket” opens the Ticket details page of the ticket whose ticket-id is specified in value.
id: “contact” opens the Contact details page of the contact whose contact-id is specified in value.

---

>title: How to use click method to open ticket or contact page
>tags: interface-method
>context: app.js
>code:

# How to use click method to open ticket or contact page
The method opens the ticket or contact details page of a specific ticket or contact. Use the sample code shown to enable your app to open the ticket or contact details page.

## Open ticket page
```js
try {
  let data = await client.interface.trigger("click", {
    id: "ticket",
    value: 1
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```
## Open contact page
```js
try {
  let data = await client.interface.trigger("click", {
    id: "contact",
    value: 1
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

---

>title: How to display or hide CTI dialler using interfaces in Freshworks apps
>tags: interface-method
>context: app.js
>code:

# How to display or hide CTI dialler    

To enable an app deployed at the cti_global_sidebar to open or hide a phone dialler,
1. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (product on which the app is deployed) passes a client reference to the app.
2. After app initialization, to open or hide the dialler in an iFrame, use the following method:
```js
client.interface.trigger("<show or hide>", {
  id: "softphone"
})
```
## Show dialler
```js
try {
  let data = await client.interface.trigger("show", {
    id: "softphone"
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

## Hide Dialler
```js
try {
  let data = await client.interface.trigger("hide", {
    id: "softphone"
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

---

>title: How to display or hide missed calls
>tags: interface-method
>context: app.js
>code:

# How to display or hide missed calls

To enable an app deployed at the cti_global_sidebar to display or hide the number of missed calls on the CTI widget,
1. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (product on which the app is deployed) passes a client reference to the app.
2. After app initialization, to display or hide the number of missed calls, use the following method:
```js
client.interface.trigger("<show or hide>", {
  id: "missedCall"
})
```
Display missed calls
```js
try {
  let data = await client.interface.trigger("show", {
    id: "missedCall"
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```
 Hide missed calls
```js
try {
  let data = await client.interface.trigger("hide", {
    id: "missedCall"
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

---

>title: What are the elements on the ticket details page on which hide/display can be performed
>tags: interface-method
>context: app.js
>content:

# What are the elements on the ticket details page on which hide/display can be performed

1. Hide/display or enable/disable UI elements action can be performed on the Ticket details page on the following elements
	a. attachments
    b. attachmentsDelete
    c. ticketSpam
    d. ticketEdit
    e. ticketDelete
    f. ticketDueBy
    g. reply
    h. note
    i. forward
    j. noteEdit
2. Hide/display or enable/disable UI elements action can be perfomed on the Ticket details page on the following elements in the properties widget
    a. status
    b. priority
    c. ticket_type
    d. group
    e. product
    f. cf_custom_field
    g. tag
3. Hide/display or enable/disable UI elements action can be perfomed on the Ticket details page on the following elements in editor window
    a. from
    b. cc
    c. bcc

---

>title: On which elements in Freshdesk can you set the value of a field/dropdown/options in dropdown on the ticket details page
>tags: interface-method
>context: app.js
>content:

# On which elements in Freshdesk can you set the value of a field/dropdown/options in dropdown on the ticket details page

1. Set the value of a field on the Ticket details page in Properties widget on the following elements:
    a. status
    b. priority
    c. ticket_type
    d. group
    e. product
    f. cf_custom_field
    g. tag
2. Set the value of a field on the Ticket details page in Editor window on the following elements:
    a. to
    b. from
    c. cc
    d. bcc
    e. noteType
    f. notifyTo
3. Set the options of a drop-down field on the Ticket details page in the Editor window	on the noteType element

---

>title: How to mimic click actions on the ticket details page using interface method
>tags: interface-method
>context: app.js
>content:

# How to mimic click actions on the ticket details page using interface method

1. Mimic click actions on the Ticket details page on the following elements
	a. timer
    b. expandConversation
2. Mimic click actions on the Ticket details page in Editor window on the following elements
    a. Open reply editor button: Open the reply editor window with a text insert
    b. Reply button: Reply without the show-quoted-text link
    c. Open note editor button: Open the note editor with a text insert

---

>title: What interface action can an app deployed in Freshdesk in ticket_conversation_editor, time_entry_background, ticket_background perform?
>tags: interface-method
>context: app.js
>content:

#  What interface action can an app deployed in Freshdesk in ticket_conversation_editor, time_entry_background, ticket_background perform?

1. Set the value of a field on the Ticket details page > Editor window (if the window is already open) on the text editor element of the Editor window at ticket_conversation_editor.
2. Hide/display or enable/disable UI elements on the Ticket details page > TIME LOGS widget > Log time window on all fields in Log time window at time_entry_background
3. Set the value of a field on the Ticket details page > TIME LOGS widget > Log time window on all fields in Log time window at ticket_background

---

>title: How to hide/display or enable/disable UI elements using interfaces
>tags: interface-method
>context: app.js
>code:

# How to hide/display or enable/disable UI elements using interfaces

To enable your app to hide an UI element, display a hidden element, disable a UI button, or enable a disabled button,
1. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (the product on which the app is deployed) passes a client reference to the app.
2. After app initialization, to a hide/display or enable/disable UI element, use the following method:
```js
client.interface.trigger("<method-name>", {
  id: "<element-name>"
})
```
<method-name> is the action to be performed. Possible values: hide, show, enable, disable
<element-name> is the element to be hidden or displayed; disabled or enabled.

---

>title: How to set the value of a field using interfaces
>tags: interface-method
>context: app.js
>code:

# How to set the value of a field using interfaces

To enable your app to set the value of a UI field,
1. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (the product on which the app is deployed) passes a client reference to the app.
2. After app initialization, use the following method:
```js
client.interface.trigger("setValue", {
  id: "<element-name>",
  value: "<value to be set>"
})
```
<element-name> is the element whose value is to be set.

---

>title: How to set the options of a drop-down field using interfaces
>tags: interface-method
>context: app.js
>code:

# How to set the options of a drop-down field using interfaces

To enable your app to set the options of a drop-down UI field,
1. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (the product on which the app is deployed) passes a client reference to the app.
2. After app initialization, use the following method:
```js
client.interface.trigger("setOptions", {
  id: "<element-name>",
  value: [value1, value2]
})
```
<element-name> is the element whose drop-down list is to be populated.

[value1, value2] are the drop-down options, specified as an array.

---

>title: What interface actions can be deployed on the Contact List page in Freshdesk perform?
>tags: interface-method
>context: app.js
>content:

# What interface actions can be deployed on the Contact List page in Freshdesk perform?

1. Hide/display UI element on the Contact list page	in the Edit menu-option
2. Hide/display or enable/disable UI elements on the Contact list page > Edit contact window(navigate using the Edit menu-option on the Contact list page) in all Edit contact window fields listed below :
tags, unique_external_id, mobile, email, twitter_id, address, phone, language, description, time_zone, element_name

---

>title: What interface actions can be deployed on the Company details page in Freshdesk perform?
>tags: interface-method
>context: app.js
>content:

# What interface actions can be deployed on the Company details page in Freshdesk perform?

Hide/display or enable/disable UI elements on the Company details page > DETAILS widget (and Edit company window) on All DETAILS widget (and Edit company window) fields as listed below :
About, Notes, Domains for this company, Health score, Account tier, Renewal date, Industry, Any custom field

---

>title: What interface actions can be deployed on the Company list page in Freshdesk perform?
>tags: interface-method
>context: app.js
>content:

# What interface actions can be deployed on the Company list page in Freshdesk perform?

Hide/display or enable/disable UI elements on the Company list page > Edit company window (navigate using the Edit menu-option on the Company list page) on all Edit company window fields listed below
About, Notes, Domains for this company, Health score, Account tier, Renewal date, Industry, Any custom field

---

>title: How to open ticket details page using the interface method
>tags: interface-method
>context: app.js
>code:

# How to open ticket details page using the interface method

To enable your app to open the ticket details pages,
1. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (product on which the app is deployed) passes a client reference to the app.
2. After app initialization, to open the ticket details page, use the following method:
```js
client.interface.trigger("openTicket", {
id: "<id of the ticket to be opened>"
})
```

---

>title: When should I use openTicket method? Share an example.
>tags: interface-method
>context: app.js
>code:

# When should I use openTicket method? Share an example.

The method opens the ticket details page of a specific ticket. Use the sample code to enable your app to open the ticket details page.
```js
try {
  let data = await client.interface.trigger("openTicket", {
    id: "5"
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

---

>title: How to open requester details page using interface method
>tags: interface-method
>context: app.js
>code:

# How to open requester details page using interface method

To enable your app to open the requester details pages,
1. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (product on which the app is deployed) passes a client reference to the app.
2. After app initialization, to open the requester details page, use the following method:
```js
client.interface.trigger("openRequester", {
id: "<id of the requester>"
})
```
---

>title: When should I use openRequester method? Share an example.
>tags: interface-method
>context: app.js
>code:

# When should I use openRequester method? Share an example.

The method opens the requester details page of a specific requester. Use the sample code shown on the right pane, to enable your app to open the requester details page.
```js
try {
  let data = await client.interface.trigger("openRequester", {
    id: 29001569616
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```
---

>title: What interface actions can an app deployed on the Ticket details page perform in Freshservice?
>tags: interface-method
>context: app.js
>content:

# What interface actions can an app deployed on the Ticket details page perform in Freshservice?

1. Hide/display or enable/disable UI elements on the Ticket details page on the following elements : attachments, ticketDelete, dueDateby, note
2. Hide/display or enable/disable UI elements on the Ticket details page > Properties widget on the foll elements : status, priority, source, impact, urgency, type, agent, department, category, group, customfield name
3. Enable/disable editor-window elements On the Ticket details page > Reply Editor window and On the Ticket details page > Forward Editor window on the from element in UI
4. Set the value of an editor-window field on the Ticket details page > Reply Editor window / on the Ticket details page > Forward Editor window on the from element in UI
5. Set the value of a field on the Ticket details page > Properties widget on the foll elements : status, priority, source, impact, urgency, type, agent, department, category, group, customfield name
6. Set the value of a field On the Ticket details page > Add note window/editor on Visible to the customer toggle
7. Mimic click actions On the Ticket details page  on the following elements : timer, expandConversations, Reply button: Open the reply editor window with a text insert, Add note button:Open the note editor with a text insert, Tasks > Add new button:Open the add task window with a text insert
8. Mimic click actions	On the Ticket details page > Properties widget	Update button: Submit updated ticket properties

---

>title: How to enable/disable editor window element using interface method
>tags: interface-method
>context: app.js
>code:

# How to enable/disable editor window element using interface method

To enable your app to disable an element or enable an element, on the reply or forward editor,
1. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (the product on which the app is deployed) passes a client reference to the app.
2. After app initialization, to a enable/disable an editor window element, use the following method:
```js
client.interface.trigger("<method-name>", {
  id: "<window-name>",
  field: "<element-name>"
})
```
<method-name> is the action to be performed. Possible values: enableElement, disableElement
<window-name> is the action to be performed. Possible values: reply, forward
<element-name> is the element to be disabled or enabled. Possible value: from

---

>title: How to set the value of an editor-window field using interface method
>tags: interface-method
>context: app.js
>code:

# How to set the value of an editor-window field using interface method

To enable your app to set the value of an element, on the reply or forward editor,
1. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (the product on which the app is deployed) passes a client reference to the app.
2. After app initialization, use the following method:
```js
client.interface.trigger("setValue", {
  id: "<window-name>",
  field: "<element-name>",
  value: "<value to be set>"
})
```
<window-name> is the editor window name. Possible values: reply, forward
<element-name> is the element (on the reply or forward window) on which the app acts. Possible value: from

---

>title: How to start and stop timer using interface method
>tags: interface-method
>context: app.js
>code:

# How to start and stop timer using interface method

## To start a timer, use the following method:
```js
client.interface.trigger("start", {
  id: "timer",
  value: {<payload needed for the timer action, specified as an
      object of key:value pairs}})
```
## To toggle (if started stop or if stopped start) a timer, use the following method:
```js
client.interface.trigger("toggle", {
  id: "timer"
})
```

---

>title: What are the UI elements that a custom app can act on in Freshservice
>tags: interface-method
>context: app.js
>content:

# What are the UI elements that a custom app can act on in Freshservice

The following are the UI elements that a custom app can act on in Freshservice : attachments, ticketDelete, dueDateEdit, note, timer, expandConversations, openReply, openNote, addTask, updateProperties, noteType

---

>title: What interface actions can an app deployed on the Contact Details page perform in Freshservice?
>tags: interface-method
>context: app.js
>content:

# What interface actions can an app deployed on the Contact Details page perform in Freshservice?

1. Hide/display UI element on the Change details page > CHANGE PROPERTIES widget status, priority, impact, risk, type, agent, department, category, group, plannedStartDate, plannedEndDate, customField
2. Hide/display or enable/disable UI elements On the Change details page > Change view (main viewport) in Planning section (planningFields)
3. Set the value of a field	On the Change details page > CHANGE PROPERTIES widget on the following elements : status, priority, source, impact, urgency, type, agent, department, category, group, customfield name

---

>title: What interface actions can an app deployed on the New ticket (Tickets > New Incident) page perform?
>tags: interface-method
>context: app.js
>content:

# What interface actions can an app deployed on the New ticket (Tickets New Incident) page perform?
1. Hide/display or enable/disable UI elements on the New Incident page on the following UI elements : status, priority, impact, urgency, agent, department, category, group, customfield
2. Set the value of a field on the New Incident page on the following UI elements : status, priority, impact, urgency, agent, department, category, group, customfield

---

>title: What interface actions can an app deployed on the  New change (Changes > Create a New Change) page perform?
>tags: interface-method
>context: app.js
>content:

# What interface actions can an app deployed on the  New change (Changes > Create a New Change) page perform?

1. Hide/display or enable/disable UI elements on the Create a New Change page on the following UI elements : type, status, priority, impact, risk, group, agent, department, category, plannedStartDate, plannedEndDate, planningFields, customfield
2. Set the value of a field on the Create a New Change page on the following UI elements: type, status, priority, impact, risk, group, agent, department, category, plannedStartDate, plannedEndDate, planningFields, customfield

---

>title: How to open ADD LEAD, ADD CONTACT, ADD ACCOUNT, ADD DEAL, or CALL LOG windows using the interface method
>tags: interface-method
>context: app.js
>code:

# How to open ADD LEAD, ADD CONTACT, ADD ACCOUNT, ADD DEAL, or CALL LOG windows using the interface method

To enable your app to open the ADD LEAD, ADD CONTACT, ADD ACCOUNT, ADD DEAL, or CALL LOG windows,

1. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (product on which the app is deployed) passes a client reference to the app.
2. After app initialization, to open specific windows, use the following method:
```js
client.interface.trigger("open", {
  id: "<window-name>"
})
```
<window-name> is the window to be opened. Possible values: lead, contact, account, deal, calllog

## Open ADD LEAD window
```js
try {
  let data = await client.interface.trigger("open", {
    id: "lead"
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

## Open ADD CONTACT window
```js
try {
  let data = await client.interface.trigger("open", {
    id: "contact"
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

## Open ADD ACCOUNT window
```js
try {
  let data = await client.interface.trigger("open", {
    id: "account"
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

## Open ADD DEAL window
```js
try {
  let data = await client.interface.trigger("open", {
    id: "deal"
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

---

>title: How to open lead, contact, account, or deal details page
>tags: interface-method
>context: app.js
>code:

# How to open lead, contact, account, or deal details page

To enable your app to open the Lead, Contact, Account, or Deal details page,
1. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (product on which the app is deployed) passes a client reference to the app.
2. After app initialization, to open specific pages, use the following method:
```js
client.interface.trigger("show", {
  id: "<lead, contact, account, or deal>",
  value: <id of the lead, contact, account, or deal to be opened>
})
```
id: "lead" opens the Lead details page of the lead whose lead-id is specified in value.
id: "contact" opens the Contact details page of the contact whose contact-id is specified in value.
id: "account" opens the Account details page of the account whose account-id is specified in value.
id: "deal" opens the Deal details page of the deal whose deal-id is specified in value.

## Open LEAD details page
```js
try {
  let data = await client.interface.trigger("show", {
    id: "lead",
    value: 1
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

## Open CONTACT details page
```js
try {
  let data = await client.interface.trigger("show", {
    id: "contact",
    value: 1
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

## Open ACCOUNT details page
```js
try {
  let data = await client.interface.trigger("show", {
    id: "account",
    value: 1
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

## Open DEAL details page
```js
try {
  let data = await client.interface.trigger("show", {
    id: "deal",
    value: 1
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

---

>title: How to clear the value of a field using interface method
>tags: interface-method
>context: app.js
>code:

# How to clear the value of a field using interface method

To enable your app to clear the value of a UI field,
1. Navigate to the app.js file. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application (the product on which the app is deployed) passes a client reference to the app.
2. After app initialization, use the following method:
```js
client.interface.trigger("clearValue", {
  id: "<element-name>"
})
```
<element-name> is the element whose value is to be cleared.

---
