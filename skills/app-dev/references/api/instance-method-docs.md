>title: what are instance method in freshworks apps
>tags:  instance-method, app-framework, communication, resize, modal
>context: app.js, modal.html,
>content:

# What are Instance Method in Freshworks apps

Instance methods enable a single app to exist in multiple locations or modals on the same page. An app location may open up one or more modals. The locations and modals can be thought of as separate instances of the app and can be resized, closed, and communicate with each other. The app framework provides instance methods to enable these use cases.

# Key features of Instance Methods

- Multi-Instance Support: Enables apps to operate in multiple locations or modals simultaneously.
- Inter-Instance Communication: Facilitates seamless data exchange between instances.
- Custom Sizing: Allows resizing of app instances to suit user needs.
- Error Handling: Provides robust mechanisms to handle issues such as instance unavailability.

---
>title: how to resize an instance
>tags:  instance-method, app-framework, communication, resize, modal
>context: app.js, modal.html,
>code:

# How to resize an Instance

You can manually set the height of an app instance with client.instance.resize(). The maximum height for an instance is 700px. This works for modals and dialogs as well. If the instance occupies more space than this, scroll bars appear.

```js
client.instance.resize({ height: "500px" });
```

---
>title: error handling in instance method
>tags:  instance-method, app-framework, communication, resize, modal
>context: app.js, modal.html,
>code:

# Error Handling in Instance method

```js
try {
  client.instance.resize({ height: "500px" });
} catch (error) {
  console.error("Failed to resize instance:", error);
}
```

---
>title: how to close an instance
>tags:  instance-method, app-framework, communication, resize, modal
>context: app.js, modal.html,
>code:

# How to close an Instance

You can close the instance with

```js
client.instance.close();
```

---
>title: how to communicate between instances
>tags:  instance-method, app-framework, communication, resize, modal
>context: app.js, modal.html,
>content:

# How to communicate between Instances

You can communicate between instances like

1. Send data from a parent location to a modal - When a modal is opened, the location can send data to pre-populate form fields.
2. Send data from a modal to a parent location - When a user fills a form in a modal window, some of this data may need to be returned to the parent.
3. Send data from one location to another location - In the case of an app that is present in two locations on the same page, a button click in one location can be used to trigger an action in the second location.

# What are the methods available to communicate between Instances?

- Context: To fetch information about the current instance.
- Get: To fetch context information of all active instances.
- Send: To send data to other instances.
- Receive: To receive data from other instances.

---
>title: how to use the context method?
>tags:  instance-method, app-framework, communication, resize, modal
>context: app.js, modal.html,
>code:

# How to use the Context method?

You can fetch information about the current instance using `context`. For example, modals contain information about the parent location which triggered them and any data that was passed to them.

parent_location_template.html

```js
try {
  let data = await client.instance.context();
    console.log(data); // context
} catch (error) {
    console.error(error);
}
```
It returns the following data

```js
{
  instanceId: "1",
  location: "ticket_requester_info"
}
```
Attributes

- `instanceId`: Each instance is auto-assigned with an ID.
- `location`: The location of the current instance.

modal.html

```js
try {
    let context = await client.instance.context();
} catch (error) {
    console.error(error);
}
```
It returns the following data

```js
{
  instanceId: "4",
  location: "modal",
  parentId: "1",
  modalData: "This ticket is created by Rachel"
}
```
Attributes

- `instanceId`: Each instance is auto-assigned with an ID.
- `location`: The location of the current instance.
- `parentId`: ID of the parent instance that triggered the modal.
- `modalData`: (optional) This parameter contains data sent from the parent instance.

---
>title: how to use the get method?
>tags:  instance-method, app-framework, communication, resize, modal
>context: app.js, modal.html,
>code:

# How to use the get method?

The get method is used to fetch context information of all instances that are active at the time of the `get()` call. It can be used in conjunction with the `send()` method to send data to a specific instance.

## Using the get method at a location

ticket_sidebar_template.html or modal.html

```js
try {
  let data = await client.instance.get();
} catch (error) {
    console.error(error);
}
```

Output

```js
[
  {instanceId: "1", location: "ticket_requester_info"},
  {instanceId: "2", location: "ticket_sidebar"},
  {instanceId: "4", location: "modal", parentId: "1"}
]
```

Get method output attributes

- `instanceId`: Each instance is auto-assigned with an ID.
- `location`: The location of the current instance.
- `parentId`: ID of the parent instance that triggered the modal.

---

>title: how to use the send method?
>tags:  instance-method, app-framework, communication, resize, modal
>context: app.js, modal.html,
>code:

# How to use the Send method?

You can use the send method to send data to one or many instances. The `receive()` method should be used in the destination instance(s) to receive data. The syntax varies according to the scenario as shown below.
ticket_sidebar_template.html

```js
try {
  await client.instance.send({
      message: {
          name: "James",
          email: "James@freshdesk.com"
      },
      receiver: ["instanceID1", "instanceID2"]
  });
} catch (error) {
    console.error(error);
}
```

- `message`:  Data that is sent from location/modal. message can be a string, object, or array.
- `receiver`: InstanceId(s) of the receiver locations.
modal.html

```js
try {
  await client.instance.send({
      message: {
          name: "James",
          email: "James@freshdesk.com"
      }
  });
} catch (error) {
    console.error(error);
}
```
`send` returns the following attributes

- `message`:  Data that is sent from location/modal. message can be a string, object, or array.

The destination instances must be active when data is sent. You can retrieve all active instances using the get() method.

---

>title: how to use the recieve method?
>tags:  instance-method, app-framework, communication, resize, modal
>context: app.js, modal.html,
>code:

# How to use the Recieve method?

This method is used to receive data that is sent by another instance of the same app using the `send()` method. Whenever data is sent to the instance, the callback method is executed.
Recieving at ticket_sidebar_template.html or modal.html

```js
client.instance.receive(
  function(event) {
    let data = event.helper.getData();
    console.log(data);
    /* data contains {senderId: "1", message: { message: {name: "James", email: "James@freshdesk.com"}} */
    }
);  console.error(error);
```

`data` returns the following attributes.

- `message`:  Data that is sent from location/modal. `message` can be a string, object, or array.
- `senderId`: InstanceId(s) of the sender location/modal.

---
>title: example of sending data from a parent location to a modal
>tags:  instance-method, app-framework, communication, resize, modal
>context: app.js, modal.html,
>code:

# Example of sending data from a parent location to a modal

There is a ticket sidebar app with Name, Email as input fields and a button 'Show Modal' .User enters information (Name and Email) and clicks the `Show Modal` button, the values are sent to the modal.

1. Add an additional parameter data in `showModal()` so that information is available in the modal.

  ticket_sidebar_template.html

  ```js
  try {
  await client.interface.trigger("showModal", {
    title: "Information Form",
    template: "modal.html",
    data: {
      name: "James",
      email: "James@freshdesk.com"
    }
  });
  } catch (error) {
    console.error(error);
  }
  ```

2. Retrieve the data using the `context()` method.

  modal.html

  ```js
  try {
  let context = await client.instance.context();
  console.log("Modal instance method context", context);
    /* Output: Modal instance method context
    {
      instanceId: "4",
      location: "modal",
      parentId: "1",
      modalData: {name: "James", email: "James@freshdesk.com"} }"
    */
  document.querySelector("#name").val(context.modalData.name);
  document.querySelector("#email").val(context.modalData.name);
  } catch (error) {
    console.error(error);
  }
  ```

Here, `modalData` contains `data` that was passed using `showModal`.

---

>title: example of sending data from a modal to a parent location
>tags:  instance-method, app-framework, communication, resize, modal
>context: app.js, modal.html,
>code:

# Example of sending data from a modal to a parent location

Data can be transferred from a modal to its parent location `ticket_requester_info` using the `send()` and `receive()` methods. When a user enters the information (Name and Email) and clicks the Send button in the modal, the user input is populated in ticket_requester_info(parent location).

1. Send the data from the modal using `send()` method.

  modal.html

  ```js
  client.instance.send({
  message: {name: "James", email: "james.dean@freshdesk.com"}});
  /* message can be a string, object, or array */
  ```

2. Receive the data using the `recieve()` method.

  ticket_sidebar_template.html

  ```js
  client.instance.receive(
  function(event) {
    let data = event.helper.getData();
      console.log(data);
        /* Output:
        {
        senderId: "4",
        message: {name: "James", email: "james.dean@freshdesk.com"}
       }
        */
    }
  );
  ```

---

>title: example of sending data from a modal to a parent location
>tags:  instance-method, app-framework, communication, resize, modal
>context: app.js, modal.html,
>code:

# Example of sending data from one location to another

Data can be transferred from location to another location by using `send()` and `receive()` methods in instance methods. In the following example, when a user enters information (Name and Email) and clicks the Send button in the `ticket_requester_info` location, the data is passed to the `ticket_sidebar` location.

1. Send the data from the `ticket_requester_info` location

  ticket_requester_template.html

  ```js
  let data = await client.instance.get();
  console.log("Modal instance method context", context);
    /* Output: Modal instance method context
    {
      instanceId: "1",
      location: "ticket_requester_info",
    },
    {
      instanceId: "1",
      location: "ticket_requester_info",
    }"
    */
  let sidebarApp = data.find(x => x.location === "ticket_sidebar");
  await client.instance.send({
    message: {
      name: "James",
            email: "james.dean@freshdesk.com"
              },
        receiver: sidebarApp.instanceId
    });
    /* 2 - instance ID of the receiver */
  /* message can be a string, object, or array */
  ```

2. Receive the data at `ticket_sidebar_template.html` location.

  ticket_sidebar_template.html

  ```js
  client.instance.receive(
  function(event) {
    let data = event.helper.getData();
    console.log(data);
    /* Output:
      {
        senderId: "1",
        message: { name: "James", email: "james.dean@freshdesk.com"}
      }
    */
  }
  );
  ```
  