>title: Fixing blank_key_error while using key-value store
>tags: key-value-storage, data-storage
>context: app.js, server.js
>code:

# Fixing blank_key_error while using key-value store

## Facing blank_key_error in key-value store
```
The key cannot be blank message is displayed in the error response
```

## How to fix this runtime error
Please ensure that the key is not blank to eliminate this error message. Here is an example of the correct usage of key-value store in a front-end app :
```js
client.db.set( "ticket:101", { "jiraIssueId": 15213 }).then (
  function(data) {
    // success operation
    // "data" value is { "Created" : true }
  },
  function(error) {
    // failure operation
    console.log(error)
});
```
Here `ticket:101` is the key and `{ "jiraIssueId": 15213 }` is the value in this example. The key needs to be a valid string and the value needs to be a JSON Object to eliminate this error.

---

>title: Fixing blank_value_error while using key-value store
>tags: key-value-storage, data-storage
>context: app.js, server.js
>code:

# Fixing blank_value_error while using key-value store

## Facing blank_value_error in key-value store
```
The value cannot be blank and should be of type JSON message is displayed in the error response
```

## How to fix this error
Please ensure that the value is not blank to eliminate this error message.  Here is an example of the correct usage of key-value store in a front-end app :
```js
client.db.set( "ticket:101", { "jiraIssueId": 15213 }).then (
  function(data) {
    // success operation
    // "data" value is { "Created" : true }
  },
  function(error) {
    // failure operation
    console.log(error)
});
```
Here `ticket:101` is the key and `{ "jiraIssueId": 15213 }` is the value in this example. The key needs to be a string and the value needs to be a JSON Object to eliminate this error.

---

>title: Fixing blank_attribute_error while using key-value store
>tags: key-value-storage, data-storage
>context: app.js, server.js
>code:

# Fixing blank_attribute_error while using key-value store

## Facing blank_attribute_error in key-value store
```
Attributes object cannot be empty and should be of type JSON or Array is displayed in the error response while using key-value store
```

## How to fix blank_attribute_error while using key-value store
While updating data in Key-value storage, attributes object cannot be empty. If the attributes object is empty, Attributes object cannot be empty and should be of type JSON or Array is displayed in the error response while using key-value store. To update data in key-value store, we use `client.db.update(key, "increment", attributes)`. Here, the attributes is mandatory and cannot be blank as shown in the sample code below :
```js
client.db.update("customer_id: 100", "increment", {"Interactions": 1}).then (
  function(data) {
    // success operation
    // "data" value is { "Updated" : true}
  },
  function(error) {
    // failure operation
    console.log(error)
});
```
Here `{"Interactions": 1}` refers to the fact that `Interactions` in data needs to be increased by 1. This can also be understood as Interactions = Interactions + 1.  If the attribute parameter is left empty, then this error is faced. By updating the attribute parameter as shown in the example, this error can be eliminated. To fix blank_attribute_error while using key-value store, always ensure that the attributes parameter is not empty.

---

>title: Fixing key_length_error while using key-value store
>tags: key-value-storage, data-storage
>context: app.js, server.js
>code:

# Fixing key_length_error while using key-value store

## Facing key_length_error while using key-value store
```
Key length should not exceed 60 characters is displayed in the error response
```

## How to fix this error
To eliminate this error, ensure that the key length doesn't exceed 60 characters. Here is an example of the correct usage of key-value store in a front-end app :
```js
client.db.set( "ticket:101", { "jiraIssueId": 15213 }).then (
  function(data) {
    // success operation
    // "data" value is { "Created" : true }
  },
  function(error) {
    // failure operation
    console.log(error)
});
```
Here `ticket:101` is the key and `{ "jiraIssueId": 15213 }` is the value in this example. The key needs to be a valid string that contains less than 60 characters. Here `ticket:101` is a valid string less than 60 characters, so this example won't lead to the error.

---

>title: Fixing object_size_error while using key-value store
>tags: key-value-storage, data-storage
>context: app.js, server.js
>code:

# Fixing object_size_error while using key-value store

## Facing object_size_error while using key-value store
```
The combined size of the key and value should not exceed 40KB is displayed in the error response
```

## How to fix this error
Ensure that the combined size of the key and value should not exceed 40KB. Here is an example of the correct usage of key-value store in a front-end app :
```js
client.db.set( "ticket:101", { "jiraIssueId": 15213 }).then (
  function(data) {
    // success operation
    // "data" value is { "Created" : true }
  },
  function(error) {
    // failure operation
    console.log(error)
});
```
Here `ticket:101` is the key and `{ "jiraIssueId": 15213 }` is the value in this example. The combined size of the key and value here should not exceed 40KB, to avoid this error.

---

>title: Fixing record_not_found while using key-value store
>tags: key-value-storage, data-storage
>context: app.js, server.js
>code:

# Fixing record_not_found while using key-value store

## Facing record_not_found while using key-value store
```
Record not found is displayed in the error response while using key-value store
```

## How to fix this error
record_not_found might be faced while using key-value store if your record might not have been stored earlier. Please recheck the key to ensure that you are searching for the right record. Here is an example to insert and fetch a record. Inserting a record in the key-value store :

```js
client.db.set( "ticket:101", { "jiraIssueId": 15213 }).then (
  function(data) {
    //handle data retrieved
  },
  function(error) {
    console.log(error)
});
```

Here is some sample code to fetch a record :

`client.db.get(key)` is used to retrieve stored data in front-end apps. If the retrieval is successful, the JSON value can be accessed using the data parameter in the .then function.

```js
client.db.set( "ticket:101", { "jiraIssueId": 15213 }).then (
  function(data) {
    //handle data retrieved
  },
  function(error) {
    console.log(error)
});
```

---

>title: Fixing mandatory_attrib_missing while using key-value store
>tags: key-value-storage, data-storage
>context: app.js, server.js
>code:

# Fixing mandatory_attrib_missing while using key-value store

## How to fix this error
To fix mandatory_attrib_missing while using key-value store, please ensure that the input JSON contains a key-value pair. `client.db.update(key, "increment", attributes)` is used to update data in key value store. The attributes parameter is mandatory, here is an example of the increment operation in front-end apps:

```js
client.db.update("customer_id: 100", "increment", {"Interactions": 1}).then (
  function(data) {
    // success operation
    // "data" value is { "Updated" : true}
  },
  function(error) {
    // failure operation
    console.log(error)
});
```
In this example, attributes takes the value of `{"Interactions": 1}` meaning the value of `Interactions` needs to be incremented by 1. If it were missing, then you would face mandatory_attrib_missing error while using key-value store.

---

>title: Fixing ttl_type_error while using key-value store
>tags: key-value-storage, data-storage
>context: app.js, server.js
>code:

# Fixing ttl_type_error while using key-value store

## Facing ttl_type_error while using key-value store
```
Time to live(ttl) should be of type float and a non-zero value is displayed as error message.
```

## How to fix this error
Please ensure that time to live(ttl) should be of type float and a non-zero value. Time to live (ttl) specifies the expiration period of the key in the data store in seconds. The ttl attribute supports both integer and float data types. If you do not set the ttl value or if the value is negative, the key will exist forever.
Here's some sample code that includes ttl for app.js:

```js
client.db.set( "ticket:101", { "jiraIssueId": 15213 }, {ttl: 60}).then(
  function(data) {
    // success operation
    // "data" value is { "Created" : true }
  },
  function(err) {
    // Handle error
    console.error(err.status);
    console.error(err.message);
});
```

---

>title: Fixing invalid_setIf_value while using key-value store
>tags: key-value-storage, data-storage
>context: app.js, server.js
>code:

# Fixing invalid_setIf_value while using key-value store

## How to fix this error
Please ensure that setIf is either "exist" or "not_exist". Here is an example of storing data and using setIf :
```js
client.db.set( "ticket:101", { "jiraIssueId": 15213 }, {setIf: "exist"}).then(
function(data) {
// success operation
// "data" value is { "Created" : true }
},
function(err) {
// Handle error
console.error(err.status);
console.error(err.message);
});
```
The setIf attribute takes any one of the two values: exist or not_exist. The `{setIf: "exist"}` code stores the value if the key exists in the data store and throws an error if the key does not exist in the data store. Similarly, `{setIf: "not_exist"}` stores the value if the key does not exist in the data store and throws an error if it is an existing key.

---

>title: Fixing invalid_increment_value while using key-value store
>tags: key-value-storage, data-storage
>context: app.js, server.js
>code:

# Fixing invalid_increment_value while using key-value store

## How to fix this error
Please ensure that the value passed to increment should be of type number. Here is an example :
```js
client.db.update("customer_id: 100", "increment", {"Interactions": 1}).then (
  function(data) {
    // success operation
    // "data" value is { "Updated" : true}
  },
  function(error) {
    // failure operation
    console.log(error)
});
```
Increment operation adds the new value specified in the attributes object to the existing attribute value in the data store. In this example, the value of `Interactions` is incremented by 1. If the value for Interactions key had been a string or any other type this error would be faced. If you change it to a number, then this issue can be fixed.

---

>title: Fixing invalid_append_value while using key-value store
>tags: key-value-storage, data-storage
>context: app.js, server.js
>code:

# Fixing invalid_append_value while using key-value store

## Facing invalid_append_value while using key-value store
```
The value passed to append should be of type array and should not be an empty array is displayed as error message.
```

## How to fix this error
Please ensure that the value passed to append should be of type array and should not be an empty array. Here is an example :
```js
client.db.update("agent_id: 100","append", {associated_customers: ["customer4"]}).then (
  function(data) {
    // success operation
    // "data" value is { "Updated" : true}
  },
  function(error) {
    // failure operation
    console.log(error)
});
```
Append operation appends the new value specified in the attributes object to the existing attribute value in the data store. `client.db.update(key, "append", attributes)` is used to perform the append operation. Here, `[customer4]` is mentioned as an array. Similarly, the value to be appended needs to be mentioned as an array.

---

>title: Fixing invalid_remove_attributes while using key-value store
>tags: key-value-storage, data-storage
>context: app.js, server.js
>code:

# Fixing invalid_remove_attributes while using key-value store

## Facing invalid_remove_attributes while using key-value store
```
The attributes object passed to remove action should be of type array is displayed as error message.
```

## How to fix this error
Please ensure that the attributes object passed to remove action should be of type array. Here is an example : 
```js
client.db.update("agent_id: 1234762398","remove", ["logs.ticket_id:11233", "logs.ticket_id:12312"]).then(function(data) {
  // success operation
  // "data" value is { "Updated" : true}
}, function(error) {
  // failure operation
  console.log(error)
});
```
Remove operation removes one or more attributes of the specified key, value pair in the data store. You can use the remove action to remove both top-level and nested attributes. `client.db.update(key, "remove", attributes)` is used to perform the remove operation. If the remove attributes are not present as a valid array such as `["logs.ticket_id:11233", "logs.ticket_id:12312"]` shown in the example then this error occurs. Use a valid array instead to fix this error.

---

>title: Fixing invalid_attribute_key while using key-value store
>tags: key-value-storage, data-storage
>context: app.js, server.js
>code:

# Fixing invalid_attribute_key while using key-value store

## How to fix this error
Please ensure that the keys or paths inside attributes object cannot be blank. Here is an example : 
```js
client.db.update("agent_id: 1234762398","set", {"logs.ticket_id:11233.TimeLog": 500}).then(
    function(data) {
    // success operation
    // "data" value is { "Updated" : true}
  }, function(error) {
    // failure operation
  console.log(error)
});
```
Append operation appends the new value specified in the attributes object to the existing attribute value in the data store. If the key `"agent_id: 1234762398"` or value `{"logs.ticket_id:11233.TimeLog": 500}` were missing this issue could be faced. To fix this issue, please ensure that valid strings are used as keys and valid JSON is used as value.

---

>title: How to test the rate limit error in key-value store
>tags: key-value-storage, data-storage
>context: app.js, server.js
>content:

# How to test the rate limit error in key-value store

You can mock the DB operations to happen beyond the 50 requests per minute to test the rate limit scenario with its error. If you wish to increase the rate limit, please reach out to us over Devassist.

---

>title: How to fix client is not undefined error 
>tags: key-value-storage, data-storage
>context: app.js, server.js
>code:

# How to fix client is not undefined error 

This error occurs if the app is not initialised. Use the `app.initialised()` method as shown below to fix it :

```js
let client;
init();
async function init() {
  client = await app.initialized();
 
}
```