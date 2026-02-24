>title: What is Data store in Freshworks apps
>tags: key-value-store, data-store, entity-store
>context: app.js, server.js
>content:

# What is Data store in Freshworks apps

The developer platform provides the Data store to allow developers to persist and use data across the app lifecycle. The data stores are accessible through run-time interfaces. There are two types of Data stores available in Freshworks apps:
1. The Key-value store allows you to store data as keys with a corresponding value of limited size. 
2. Entity store requires you to declare an entity schema as a configuration. Then, you can create and manipulate records of the same type in the app code. 

---

>title: When can I use the Data Store be used in Freshworks apps
>tags: key-value-store, data-store, entity-store
>context: app.js, server.js
>content:

# When can I use the Data Store be used in Freshworks apps

If there is a need to persist data and use it across the app lifecycle, then the Data Store can be used.
1. The Key-value store allows you to store data as keys with a corresponding value of limited size. The Key-value store is ideal for storing app data, where the developer knows the keys at query time, thereby enabling a lookup operation against the store.  
2. Entity store requires you to declare an entity schema as a configuration. Then, you can create and manipulate records of the same type in the app code. An entity store is ideal for querying/filtering/listing use-cases.

---

>title: Is the data stored in with Freshworks data store secure, can it be encrypted
>tags: key-value-store, entity-store, data-store
>context: app.js, server.js
>content:

# Is the data stored in with key-value store secure

Encryption is not supported in the data store in Freshworks apps. However, the data stored in Freshworks data store (both Key-value store and entity store) for any Freshworks app is stored in Freshworks cloud environment, which is highly secure. The Freshworks platform runs on the same environment. So, the data is securely stored and retrieved reliably.

---

>title: What are the considerations for global apps that use key-value store
>tags: key-value-store, entity-store, data-store
>context: app.js, server.js
>content:

# What are the considerations for global apps that use key-value store

Consider a case where your global app has two modules. The modules belong to different products and on deployment are deployed on different SKUs (that is, different product bundles). In the local environment, the logic specific to one of these modules can access and use a value that the other module stores in the Key-value storage (KV store). So, the local testing of your app is successful. In production, this cross-SKU access is not there. So, the app breaks.


You should implement your app logic in such a way that a module’s logic does not retrieve and use the value that the other module stores in the KV store, if the two modules cannot be deployed for the same SKU subscriptions.

---

>title: How to use Key-value store in Freshworks apps
>tags: key-value-store, data-store
>context: app.js, server.js
>code:


# How to use Key-value store in Freshworks apps

The Key-value store in Freshworks apps allows you to store data as keys with a corresponding value of limited size. Each key is a string and each value a valid JSON object. It does not require any schema to be declared ahead of time. The Key-value store is ideal for storing app data, where the developer knows the keys at query time, thereby enabling a lookup operation against the store. For example, the number of times an agent views a specific ticket, is app data that is a candidate for Key-value store. 

Using Key-value store in Freshworks apps in front-end apps (app.js code)
```js
client.db.set( "ticket:101", { "jiraIssueId": 15213 }).then (
  function(data) {
    //handle data retrieved
  },
  function(error) {
    console.log(error)
});
```
Using Key-value store in Freshworks apps in serverless apps (server.js code)
```js
$db.set( "ticket:101", { "jiraIssueId": 15213 }).then (
  function(data) {
    // success operation
    // "data" value is { "Created" : true }
  },
  function(error) {
    console.log(error)
});
```

### Considerations for the Key-value store in Freshworks apps
1. Data is stored on a per account AND per app basis i.e., the scope is on a per installation basis
2. A rate limit of 50 requests per minute applies with each set, get, and delete counting as one request. This rate limit can be increased on a case by case basis if required, please use DevAssist to raise a request for the same.
3. The key should not be blank and its length should not exceed 60 characters.
4. The combined size of the key and value should not exceed 40 KB.

---

>title: What are the operations that can be performed on the Key-value store
>tags: key-value-store, data-store, store, retrieve, update, delete
>context: app.js, server.js
>content:

# What are the operations that can be performed on the Key-value store

The following operations can be performed in the Key-value store:
1. Store - `client.db.set(key, value, options)` in front-end apps and `$db.set(key, value, options)` in serverless apps
2. Retrieve - `client.db.get(key)` in front-end apps and `$db.get(key, value, options)` in serverless apps
3. Update - `client.db.update(key, action, attributes)` in front-end apps and `$db.update(key, value, options)` in serverless apps
4. Delete - `client.db.delete(key)` in front-end apps and `$db.delete(key, value, options)` in serverless apps

---

>title: what are Key-value store considerations
>tags: key-value-store, data-store, store, retrieve, update, delete
>context: app.js, server.js
>content:   

# What are Key-value store considerations

1. Data is stored on a per account AND per app basis i.e., the scope is on a per installation basis. This means that if two apps have been installed by an account, data stored by one app is not accessible by the other app.
2. A rate limit of 50 requests per minute applies with each set, get, and delete counting as one request. This rate limit can be increased on a case by case basis if required, please use DevAssist to raise a request for the same.
3. The key should not be blank and its length should not exceed 60 characters.
4. The combined size of the key and value should not exceed 40 KB.
5. The value should be of type JSON and not blank or empty "{}".
6. The values in the JSON Object will be converted to null - empty strings, NaN, "+/- Infinity".
7. It does not allow querying for a select range or pattern of keys.
8. It is not ideal for storing records of the same type that need querying based on field values or where the size of the value could be larger than 32 KB. 
9. There is no limitation on how many key-value pairs can be stored in the key value store. 
10. Data in the key value store can be accessed only after an app has been installed successfully.
11. If the app is uninstalled by a customer, all the data stored by that customer is removed permanently and cannot be recovered again.
12. When a custom app is deleted, all the data across all the installed accounts are deleted irreversibly.

---

>title: What is the rate limit for requests in the Key-value store
>tags: key-value-store, data-store
>context: app.js, server.js
>content:  

# What is the rate limit for requests in the Key-value store

A rate limit of 50 requests per minute applies with each set, get, and delete counting as one request. This rate limit is applied separately for each installed app which means that if two apps have been installed by an account, the rate limit will apply separately to each app. This limit is not affected by the number of agents in the account. 

The rate limit can be increased on a case by case basis if required, please use DevAssist to raise a request for the same.

---

>title: How to use Key-value store in front-end apps to store data
>tags: key-value-store, data-store, store-data
>context: app.jsx
>content:

# How to use Key-value store to store data

`client.db.set(key, value, options)` is used in front-end apps and $db.set is used in serverless apps to store the key, value pair in the data store. If an entry with the key is already present, then the value will be updated. The options field is not mandatory and by default is an empty hash.The following attributes can be specified in the options field :

1. Time to live (ttl) : Specifies the expiration period of the key in the data store in seconds. The ttl attribute supports both integer and float data types. If you do not set the ttl value or if the value is negative, the key will exist forever.

2. Set If (setIf) : The setIf attribute takes any one of the two values: exist or not_exist. The `{setIf: "exist"}` code stores the value if the key exists in the data store and throws an error if the key does not exist in the data store. Similarly,` {setIf: "not_exist"}` stores the value if the key does not exist in the data store and throws an error if it is an existing key.

---

>title: How to use Time to live (ttl) in options field while storing data in Key-value store 
>tags: key-value-store, data-store, store-data
>context: app.js
>code:

# How to use Time to live (ttl) in options field while storing data in Key-value store

Time to live (ttl) specifies the expiration period of the key in the data store in seconds. The ttl attribute supports both integer and float data types. If you do not set the ttl value or if the value is negative, the key will exist forever.
Here's some sample code that includes ttl for app.js:

## Using Time to live (ttl) in front-end apps

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

## Using Time to live (ttl) in serverless apps

```js
$db.set( "ticket:101", { "jiraIssueId": 15213 }, {ttl: 60}).then(
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

>title: How to use Set If (setIf) in options field while storing data in Key-value store 
>tags: key-value-store, data-store, store-data
>context: app.js
>code:

# How to use Set If (setIf) in options field while storing data in Key-value store

The setIf attribute takes any one of the two values: exist or not_exist. The `{setIf: "exist"}` code stores the value if the key exists in the data store and throws an error if the key does not exist in the data store. Similarly, `{setIf: "not_exist"}` stores the value if the key does not exist in the data store and throws an error if it is an existing key.
Here's some sample code that includes setIf for app.js:

## Using setIf in front-end apps

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

## Using setIf in serverless apps

```js
$db.set( "ticket:101", { "jiraIssueId": 15213 }, {setIf: "exist"}).then(
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

Since `{setIf: "exist"}` is used while storing the record, if the key `ticket:101` exists in the data store, then the value will be stored. If the key does not exist in the data store, it throws an error.

---

>title: How to retrieve data from the Key-value store
>tags: key-value-store, data-store, retrieve-data
>context: app.js, server.js
>code:

# How to retrieve data from the Key-value store

`client.db.get(key)` is used to retrieve stored data in front-end apps and `$db.get(key)` is used in serverless apps. If the retrieval is successful, the JSON value can be accessed using the data parameter in the .then function.
## Retrieving data from Key-value store in front-end app (app.js) :
```js
try {
  let data = await client.db.get("ticket:101");
    // success
    // "data" is { "jiraIssueId": 15213 }
} catch (error) {
    console.error(error)
}
```
`$db.get(key)` is used to retrieve stored data in serverless apps. If the retrieval is successful, the JSON value can be accessed using the data parameter in the .then function. `server.js` is as follows:
## Retrieving data from Key-value store in serverless app (server.js) :
```js
try {
    let data = await $db.get("ticket:101");
    // success
    // "data" is { "jiraIssueId": 15213 }
} catch (error) {
    // failure operation
    console.error(error)
}
```

---

>title: How to use Key-value store to update data
>tags: key-value-store, data-store, update-data
>context: app.js, server.js
>content:

# How to use Key-value store to update data

`client.db.update(key, action, attributes)` in front-end apps and `$db.update(key, action, attributes)` in serverless apps update the corresponding key-value in the data store.

## What are the types of update operations that can be performed in the Key-value store
1. Increment : Adds a new value to the existing attribute value in the attributes object.
2. Append : Appends a new value to the existing attribute value in the attributes object.
3. Set : Adds one or more top-level or nested attributes and values to the key, value pair.
4. Remove : Removes one or more attributes and values from the key, value pair.

### Considerations while updating data in Key-value store
1. The key should not be blank and its length should not exceed 60 characters.
2. The value should be of type JSON and not blank or empty "{}".
3. The values in the JSON Object will be converted to null - empty strings, NaN, "+/- Infinity".

---

>title: How to use increment update operation in Key-value store to update data
>tags: key-value-store, data-store, update-data
>context: app.js, server.js
>code:

# How to use increment update operation in Key-value store to update data

Increment operation adds the new value specified in the attributes object to the existing attribute value in the data store.

## Increment operation in front-end apps
Increment operation can be used to update data in Key-value store in front-end apps (in app.js) as follows:
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

## Increment operation in serverless apps
Increment operation can be used to update data in Key-value store in serverless apps (in server.js) as follows :
```js
$db.update("customer_id: 100", "increment", {"Interactions": 1}).then (
  function(data) {
    // success operation
    // "data" value is { "Updated" : true}
  },
  function(error) {
    // failure operation
    console.log(error)
});
```
## Considerations while using increment update operation in Key-value store
1. If an attribute does not exist, the increment action adds the specified attribute and its value to the key in the data store.
2. If the new value passed in the attributes object is a negative number, then it is subtracted from the existing value.
3. If you execute the increment action on a key which does not exist in the data store, the attributes object is stored in the data store with the specified key. This is similar to the Store operation.
4. The attributes field takes an object containing the attribute name and value which you want to increment.
5. The increment action supports only number data type and can be used on top-level attributes, not nested attributes.

### Example of increment operation
Suppose you want to store the number of customer interactions in the data store. So, when a customer interacts with an agent, you store an object with Customer ID as key using client.db.set. The sample object would look like this in the data store.
Before increment:
```json
{
  "Name": "sample_customer",
  "Company": "sample_company",
  "Interactions": 3
}
```
After increment operation:
```json
{
  "Name": "sample_customer",
  "Company": "sample_company",
  "Interactions": 4
}
```

---

>title: How to use append operation in Key-value store to update data
>tags: key-value-store, data-store, update-data
>context: app.js, server.js
>code:

# How to use append operation in Key-value store to update data

Append operation appends the new value specified in the attributes object to the existing attribute value in the data store. `client.db.update(key, "append", attributes)` in front-end apps and `$db.update(key, "append", attributes)` in serverless apps are used to perform the append operation.

## Append operation can be used to update data in Key-value store in front-end apps (in app.js) as follows :
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
## Append operation can be used to update data in Key-value store in serverless apps (in server.js) as follows :
```js
$db.update("agent_id: 100","append", {associated_customers: ["customer4"]}).then (
  function(data) {
    // success operation
    // "data" value is { "Updated" : true}
  },
  function(error) {
    // failure operation
    console.log(error)
});
```
## Considerations while using append (update) operation in key-value store
1. If an attribute does not exist, the append action adds the specified attribute and its value to the key in the data store.
2. If you execute the append action on a key which does not exist in the data store, the attributes object is stored in the data store with the specified key. This is similar to the Store operation.
3. The attributes field takes an object containing the attribute name and value which you want to append.
4. The append action supports only array data type and can be used on top-level attributes, not nested attributes.

### Example of append operation
Suppose you want to store a list of customers interacting with an agent. You can create an object in the data store with Agent ID as key.
Before increment:
```json
{
  "agent_name": "sample_agent",
  "agent_type": "support",
  "associated_customers": ["customer1","customer2","customer3"]
}
```
After append operation:
```json
{
  "agent_name": "sample_agent",
  "agent_type": "support",
  "associated_customers": ["customer1","customer2","customer3","customer4"]
}
```

---

>title: How to use set operation in key-value store to update data
>tags: key-value-store, data-store, update-data
>context: app.js, server.js
>code:

# How to use set operation in Key-value store to update data
Set operation adds one or more attributes and values to the specified key, value pair in the data store. If the attributes exist, then they are replaced with the new values. You can use the set action to update both top-level and nested attributes. `client.db.update(key, "set", attributes)` in front-end apps and `$db.update(key, "set", attributes)` in serverless apps are used to perform the set operation.

## Set operation can be used to update data in key-value store in front-end apps (in app.js) as follows :
```js
client.db.update("agent_id: 1234762398","set", {"logs.ticket_id:11233.TimeLog": 500, "logs.ticket_id:11233.Updated": "True"}).then(
    function(data) {
    // success operation
    // "data" value is { "Updated" : true}
  }, function(error) {
    // failure operation
  console.log(error)
});
```
## Set operation can be used to update data in Key-value store in serverless apps (in server.js) as follows :
```js
$db.update("agent_id: 1234762398","set", {"logs.ticket_id:11233.TimeLog": 500, "logs.ticket_id:11233.Updated": "True"}).then(
    function(data) {
    // success operation
    // "data" value is { "Updated" : true}
  }, function(error) {
    // failure operation
  console.log(error)
});
```

## Considerations while using set (update) operation in Key-value store
1. The set operation adds one or more attributes and values to the specified key, value pair in the data store. If the attributes exist, then they are replaced with the new values. You can use the set action to update both top-level and nested attributes.
2. The path should be of type string and should not be empty.
3. For a top-level attribute, the path refers to the name of the attribute in string format. For a nested attribute, the path refers to the attribute path from the top-level attribute in dot notation.

### Example of set operation
Suppose, you have a timelog entry for an agent with agent ID as “key” and log information as "value" in the data store. The sample value would be as follows:
Before set operation:
```json{
 "logs": {
    "ticket_id:11233": {
      "Timelog":0,
      "Updated": "False"
    },
    "ticket_id:12312": {
      "Timelog":300,
      "Updated": "True"
    }
 },
 "agent_name": "sample name"
}
```
After set operation:
```json
{
 "logs": {
    "ticket_id:11233": {
      "Timelog":500,
      "Updated": "True"
    },
    "ticket_id:12312": {
      "Timelog":300,
      "Updated": "True"
    }
 },
 "agent_name": "sample name"
}
```

---

>title: How to use remove operation in Key-value store to update data
>tags: key-value-store, data-store, update-data
>context: app.js, server.js
>code:

# How to use remove operation in Key-value store to update data

Remove operation removes one or more attributes of the specified key, value pair in the data store. You can use the remove action to remove both top-level and nested attributes. `client.db.update(key, "remove", attributes)` in front-end apps and `$db.update(key, "remove", attributes)` in serverless apps are used to perform the remove operation.

## Remove operation can be used to remove data from Key-value store in front-end apps (in app.js) as follows :
 Remove operation in front-end apps

```js
client.db.update("agent_id: 1234762398","remove", ["logs.ticket_id:11233", "logs.ticket_id:12312"]).then(function(data) {
  // success operation
  // "data" value is { "Updated" : true}
}, function(error) {
  // failure operation
  console.log(error)
});
```

## Remove operation can be used to remove data from Key-value store in serverless apps (in server.js) as follows :
 Remove operation in serverless apps

```js
$db.update("agent_id: 1234762398","remove", ["logs.ticket_id:11233", "logs.ticket_id:12312"]).then(function(data) {
  // success operation
  // "data" value is { "Updated" : true}
}, function(error) {
  // failure operation
  console.log(error)
});
```

### Considerations while using remove (update) operation in Key-value store
1. The attributes field takes an array containing paths of the attributes which you want to remove.
2. The path should be of type string and should not be empty.
3. For a top-level attribute, the path refers to the name of the attribute in string format. For a nested attribute, the path refers to the attribute path from the top-level attribute in dot notation.

### Example of remove operation
Suppose, you have a timelog entry for an agent with agent ID as “key” and log information as "value" in the data store. The sample value would be as follows:
Before remove operation:
```json
{
 "logs": {
    "ticket_id:11233": {
      "Timelog":0,
      "Updated": "False"
    },
    "ticket_id:12312": {
      "Timelog":300,
      "Updated": "True"
    }
 },
 "agent_name": "sample name"
}
```
After remove operation:
```json
{
 "logs": {},
 "agent_name": "sample name"
}
```

---

>title: How to delete data from Key-value store
>tags: key-value-store, data-store, delete-data
>context: app.js, server.js
>code:

# How to delete data from Key-value store
Its possible to delete data from the key value store in front-end apps and serverless apps.
## How to delete data in Key-value store from a front-end app
`client.db.delete(key)` is used to delete stored data that is no longer needed in front-end apps (in app.js) as follows :
```js
client.db.delete("ticket:101").then (
  function(data) {
    // success operation
    // "data" value is { "Deleted" : true }
  },
  function(error) {
    console.log(error);
    // failure operation
});
```
## How to delete data in Key-value store from a serverless app

`$db.delete(key)` is used to delete stored data that is no longer needed in serverless apps (in server.js) as follows :
```js
$db.delete("ticket:101").then (
  function(data) {
    // success operation
    // "data" value is { "Deleted" : true }
  },
  function(error) {
    console.log(error)
    // failure operation
});
```

---

>title: How many key value pairs can be stored in the key value store in a Freshworks app
>tags: key-value-store, data-store, delete-data
>context: app.js, server.js
>content:

# How many key value pairs can be stored in the key value store in a Freshworks app

 There is no limitation on how much you can store in the key value store. However, please keep the following considerations in mind :
 1. The key should not be blank and its length should not exceed 60 characters.
 2. The combined size of the key and value should not exceed 40 KB.
 3. A rate limit of 50 requests per minute applies with each set, get, and delete counting as one request. This rate limit can be increased on a case by case basis if required, please use DevAssist to raise a request for the same.

---

>title: How to store created time in a record in key value store
>tags: key-value-store, data-store, delete-data
>context: app.js, server.js
>code:

# How to store created time in a record in key value store

In Freshdesk key-value store (localstore), the createdAt property is automatically generated by the database and is not directly accessible. However, you can store the createdAt timestamp as part of the object itself to retrieve it later. Here is an example of how you can achieve this:

When saving the object to the localstore, include the createdAt timestamp as a property within the object. For example:

```js
const objectToSave = {
  data: "Your object data",
  createdAt: new Date().toISOString() // Include the timestamp
};

client.db.set(key, objectToSave);
```

---

>title: Can we cache our database data in the key value store
>tags: key-value-store, data-store
>context: app.js, server.js
>content:

# Can we cache our database data in the key value store

Yes, some of the apps' data that will be frequently accessed can be cached with key-value store within the app. For example, applications can store frequently accessed data like content of banners and notifications in the key-value store.

---

>title: Is it possible to retrieve all data stored in key-value store
>tags: key-value-store, data-store
>context: app.js, server.js
>code:

# Is it possible to retrieve all data stored in key-value store

No, it is not possible to retrieve all data stored in the key value store. You can retrieve the data based on the key that was used to store a specific record. Here is some sample code for the same : 

 Retrieving data from Key value store in front-end app (app.js) :
```js
try {
  let data = await client.db.get("ticket:101");
    // success
    // "data" is { "jiraIssueId": 15213 }
} catch (error) {
    console.error(error)
}
```
`$db.get(key)` is used to retrieve stored data in serverless apps. If the retrieval is successful, the JSON value can be accessed using the data parameter in the .then function. `server.js` is as follows:
 Retrieving data from Key value store in serverless app (server.js) :
```js
try {
    let data = await $db.get("ticket:101");
    // success
    // "data" is { "jiraIssueId": 15213 }
} catch (error) {
    // failure operation
    console.error(error)
}
```
---