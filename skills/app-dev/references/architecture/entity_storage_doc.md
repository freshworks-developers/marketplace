
>title: what is entity schema for Freshworks apps
>tags: entity-storage, storage, app-storage, data-persistance
>context:
>content:

# what is entity schema for Freshworks apps

In Freshworks products, business data is modeled as objects. These objects are created out of specific object types. An **entity** is an object type, and the **entity definition** is the schema definition of that object type.

## Key Points
1. Examples of default native objects include Tickets, Contacts, Users, Agents, etc.
2. Attributes such as `tickets.description`, `tickets.status`, and `tickets.priority` are part of the ticket entity's schema.

---

>title: How to create a custom entity schema for Freshworks apps
>tags: entity-storage, storage, app-storage, data-persistance
>context:
>content:

# How to create a custom entity schema for Freshworks apps

You can use the custom objects feature to define new entities (object types). Once defined, entity records (objects) can be created and processed by the app to provide meaningful results.

---

>title: What all does Entity definition include
>tags: entity-storage, storage, app-storage, data-persistance
>context:
>content:

# What all does Entity definition include

Entity definition comprises the following steps:

## Components of an Entity Definition
1. **Custom Object Schema:**  
   - Define the schema specification, including all object attribute definitions.
2. **Entity Storage Initialization:**  
   - Initiate the storage mechanism for the entity.
3. **Entity Reference Acquisition:**  
   - Obtain a reference to the entity for schema and record operations.

---

>title: How to define entity schema in detail?
>tags: entity-storage, storage, app-storage, data-persistance
>context: config/entities.json
>content:

# How to define entity schema in detail?

## Steps to Define an Entity Schema
1. Navigate to the `config -> entities.json` file in your app’s root directory.
2. In `entities.json`, configure all custom objects used by the app as JSON objects. For example:

```json
{
  "<entity-name1>": {
    "fields": [
      {
        "name": "<attribute-name1>",
        "label": "<display-text>",
        "type": "<data type>"
      },
      {
        "name": "<attribute-name2>",
        "label": "<display-text>",
        "type": "<data type>",
        "filterable": <true/false>
      }
    ]
  },
  "<entity-name2>": {
    "fields": [
      {
        "name": "<attribute-name1>",
        "label": "<display-text>",
        "type": "<data type>"
      }
    ]
  }
}
```


---

>title: What are considerations while using entity schema?  
>tags: entity-storage, storage, app-storage, data-persistance  
>context:  
>content:

# What are considerations while using entity schema?

1. After app publication, modifying the entity definition requires updating the schema and submitting a new version.
2. Each business account can define a maximum of **five entities**.
3. Each entity can have a maximum of **20 fields (attributes)**.

---

>title: What are the attributes of entity schema?
>tags: entity-storage, storage, app-storage, data-persistance
>context:
>content:

# What are the attributes of entity schema?

1. **`<entity-name>`**  
   - Mandatory object type; used to create and process records.
   - Example: For a custom object called "restaurants", `<entity-name>` is `restaurants`.
2. **`fields`**  
   - Mandatory array containing field objects that define the attributes of the entity.

---

>title: What are the attributes of field object
>tags: entity-storage, storage, app-storage, data-persistance
>context:
>content:

# What are the attributes of field object

## Field Object Attributes
1. **name:**  
   - Type: String; identifier for the attribute (alphanumeric, starting with an alphabet, underscores allowed).
2. **label:**  
   - Type: String; default display name for the attribute (front-end overrides are allowed).
3. **type:**  
   - Type: String; indicates the data type. Possible values:
     - `text` (up to 64 characters)
     - `paragraph` (long text, max 2048 characters)
     - `integer` (whole numbers, max 15 digits)
     - `float` (floating-point numbers, max 15 digits)
     - `datetime` (ISO-8601 date format)
     - `boolean` (displayed as a checkbox)
     - `enum` (dropdown list; options in `choices`)
     - `date` (YYYY-MM-DD format)
     - `section` (for grouping fields; not countable as mandatory)
4. **choices:**  
   - Mandatory for `enum` type; an array of option objects. Each option contains:
     - `id` (integer)
     - `value` (string)
     - `fields` (array for grouped fields)
     - `filterable` (boolean; default false)
     - `required` (boolean; default false; cannot be mandatory for sections)

---

>title: how to initiate entity storage?
>tags: entity-storage, storage, app-storage, data-persistance
>context:
>content:

# how to initiate entity storage?

The developer platform provides a `client.db` or `$db` interface for data storage and retrieval. This interface supports entity storage with custom object schemas.

## Key Points
1. Supports creation and deletion of custom object schemas, plus CRUD operations.
2. Access entity storage via a versioned interface (v1).

## Constructor Examples
- **Frontend App:**
  ```js
  const entity = client.db.entity({ version: "v1" });
  ```
- **Serverless App:**
  ```js
  const $entity = $db.entity({ version: "v1" });
  ```

---

>title: how to obtain a reference to an entity  
>tags: entity-storage, storage, app-storage, data-persistance  
>context:  
>content:

# how to obtain a reference to an entity

## In Frontend App (app.js)
```js
const entReference = entity.get("<entity-name>");
// Example:
const restaurant = entity.get("restaurants");
```

## In Serverless App (server.js)

```js
const entReference = $entity.get("<entity-name>");
// Example:
const restaurant = $entity.get("restaurants");
```

## Summary

A successful call returns an interface with static methods such as:

- schema()
- create()
- get()
- getAll()
- update()
- delete()

---

>title: how to create entities in Freshworks apps  
>tags: entity-storage, storage, app-storage, data-persistance  
>context: config/entities.json  
>content:

# how to create entities in Freshworks apps

During app installation, entities defined in `entities.json` are created implicitly. Use the `fdk validate` and `fdk pack` commands to verify the entity definition specifications.

## Verifying Entity Creation
To view the schema of a created entity, call:
```js
entReference.schema();
// or for serverless:
$entity.get("<entity-name>").schema();
```

## Returned Metadata

A successful call returns the entity object with meta-data such as:
  - id: Unique numeric identifier.
  - name: The <entity-name> from entities.json.
  - prefix: Auto-generated prefix for internal identification.

---

>title: how to modify entity definition specification?  
>tags: entity-storage, storage, app-storage, data-persistance  
>context: config/entities.json  
>content:

# how to modify entity definition specification?

## Key Points
- After app publication, modifying the entity definition (in `entities.json`) requires a new app version.
- You can add new entities or delete existing ones (deleting an entity deletes all its records).
- Modifying the `<entity-name>` deletes the previous entity and its records.
- Within `<entity-name>.fields`:
  - You can add or delete field objects.
  - Modifying `fields.name` deletes the old attribute and creates a new one.
  - You cannot modify `fields.type` or `fields.filterable` for existing fields.
  - You can change `fields.required`; if set to true, existing records without a value are stored as null.
  - For `enum` types, `fields.choices` cannot be modified.
  - For `section` types, you can add or delete fields.

---

>title: how to define record operations for entities
>tags: entity-storage, storage, app-storage, data-persistance
>context:
>content:

# how to define record operations for entities

The custom objects interface supports the following operations on records:

## Supported Record Operations
1. **Create** records.
2. **Update** a record.
3. **Retrieve** records.
4. **Retrieve** a specific record.
5. **Retrieve all** records.
6. **Apply filters** to retrieve specific records.
7. **Delete** a record.

## Response Meta-data
- `display_id`: Unique identifier combining the entity prefix and an incremental number.
- `created_at`: Timestamp (ISO-8601 format).
- `updated_at`: Timestamp (ISO-8601 format).

---

>title: how to create a record in an entity
>tags: entity-storage, storage, app-storage, data-persistance
>context:
>content:

# how to create a record in an entity

## Record Creation Process
To create a record, use:

```js
entReference.create({
  <fields.name1>: <valid value for fields.name1>,
  <fields.name2>: <valid value for fields.name2>
});
```

### Using in Frontend App (app.js):

```js
try {
  let data = await restaurant.create(newRestaurant);
  // Success message
} catch (error) {
  console.error(error);
}
```

#### Sample Payload:
```json
{
  "restaurant_name": "Barbq Nation",
  "short_code": "BBQN",
  "description": "Unique dining experience",
  "photo_url": "path/img.src",
  "loc_zipcode": "600105",
  "catalog_status": "Pending"
}
```

#### Successful Create Response:

```json
{
  "record": {
    "display_id": "scshv-2",
    "created_time": "2020-12-09T11:24:47.230Z",
    "updated_time": "2020-12-09T11:24:47.230Z",
    "data": {
      "restaurant_name": "Barbq Nation",
      "short_code": "BBQN",
      "description": "Unique dining experience",
      "photo_url": "path/img.src",
      "loc_zipcode": "600105",
      "catalog_status": "Pending"
    }
  }
}
```

---

>title: How to update a record inside an entity store  
>tags: entity-storage, storage, app-storage, data-persistance  
>context:  
>content:

# How to update a record inside an entity store

To update a record, use:
```js
entReference.update("<display-id>", {
  <fields.name1>: <valid value for fields.name1>,
  <fields.name2>: "<valid value for fields.name2>"
});
```

## Notes

- <entReference> refers to the entity reference.
- <display-id> is the unique identifier returned during record creation.
- All required attributes (per entities.json) must be included.


---

>title: how to update a record in entity store of a serverless apps  
>tags: entity-storage, storage, app-storage, data-persistance  
>context: server.js  
>content:

# how to update a record in entity store of a serverless apps

## Summary
1. Call the `update` method on your entity reference in `server.js`.  
2. Pass the record’s display ID and the fields to update.  
3. Check `record.data` for the updated record details.

## Step: Update a Record
Use the `update` interface on your entity reference:
```js
const record = await <entReference>.update("<display-id>", {
  <fields.name1>: <valid value for fields.name1>,
  <fields.name2>: "<valid value for fields.name2>"
});
```

## Example

```js
const record = await restaurant.update("scshv-2", {
  "restaurant_name": "Barbq Country",
  "short_code": "BBQC"
});
```

## Response Structure
The updated record is returned in `record.data`:

```json
{
  "record": {
    "display_id": "scshv-2",
    "created_time": "2020-12-09T11:24:47.230Z",
    "updated_time": "2020-12-09T11:28:00.111Z",
    "data": {
      "restaurant_name": "Barbq Country",
      "short_code": "BBQC",
      "description": "Unique dining experience",
      "photo_url": "path/img.src",
      "loc_zipcode": "600105",
      "catalog_status": "Pending"
    }
  }
}
```

---

>title: how to retrieve a record from an entity store  
>tags: entity-storage, storage, app-storage, data-persistance  
>context:  
>content:

# how to retrieve a record from an entity store

To retrieve a specific record, use:
```js
entReference.get("<display-id>");
// Example: restaurant.get("scshv-2");
```

## Example
```js
restaurant.get("scshv-2");
```

## Response Structure

```json
{
  "record": {
    "display_id": "scshv-2",
    "created_time": "2020-12-09T11:24:47.230Z",
    "updated_time": "2020-12-09T11:28:00.111Z",
    "data": {
      "restaurant_name": "Barbq Country",
      "short_code": "BBQC",
      "description": "Unique dining experience",
      "photo_url": "path/img.src",
      "loc_zipcode": "600105",
      "catalog_status": "Pending"
    }
  }
}
```


---

>title: how to retrieve an entity record with the display id in serverless apps?  
>tags: entity-storage, storage, app-storage, data-persistance  
>context: server.js  
>content:

# how to retrieve an entity record with the display id in serverless apps?

## Step: Use the `$entity` Interface
```js
const record = await $entity
  .get("<entity-name>")
  .get("<display-id>");
```

## Notes
- Replace `<entity-name>` with your entity key from `entities.json`.
- The returned `record.data` contains the object fields.

---

>title: how to retrieve all records of an entity?  
>tags: entity-storage, storage, app-storage, data-persistance  
>context: app.js  
>content:

# how to retrieve all records of an entity

## Step: Call `getAll()`
```js
<entReference>.getAll();
```

## Example

```js
async function loadRestaurants() {
  try {
    let data = await restaurant.getAll();
    // Render list of restaurants
  } catch (error) {
    console.error(error);
  }
}
```

## Sample Response
```json
{
  "records": [
    {
      "display_id": "scshv-1",
      "created_time": "2020-12-09T11:24:47.230Z",
      "updated_time": "2020-12-09T11:28:00.111Z",
      "data": { /* ... */ }
    }
  ],
  "links": {
    "next": { "marker": "Lbr2zerj3WHNDsZ1NsdFj7NiigDlittVkGc7RmPjKF3" }
  }
}
```

---

>title: how to apply filters and retrieve specific records from entity storage  
>tags: entity-storage, storage, app-storage, data-persistance  
>context: server.js  
>content:

# how to apply filters and retrieve specific records from entity storage

## Notes
- Only fields marked `filterable` in schema can be queried.
- For `datetime` filters, use ISO-8601 strings.

## Step: Include a `query` Parameter
```js
<entReference>.getAll({
  query: {
    <filterable field-name>: "<filter criteria value>"
  }
});
```

---

>title: how to retrieve records with $or query filter?  
>tags: entity-storage, storage, app-storage, data-persistance  
>context: server.js  
>content:

# how to retrieve records with $or query filter?

## Example: `$or` Filter
```js
async function loadRestaurants() {
  try {
    let data = await restaurant.getAll({
      query: {
        $or: [
          { loc_zipcode: "600123" },
          { loc_zipcode: "600106" }
        ]
      }
    });
    // Process filtered records
  } catch (error) {
    console.error(error);
  }
}
```

## Sample Response
Records matching either condition are returned with pagination links.


---

>title: how to retrieve the next set of records with $or filter with marker?  
>tags: entity-storage, storage, app-storage, data-persistance  
>context: server.js  
>content:

# how to retrieve the next set of records with $or filter with marker?

## Step: Add `next.marker`
```js
const data = await restaurant.getAll({
  query: {
    $or: [
      { loc_zipcode: "600123" },
      { loc_zipcode: "600106" }
    ]
  },
  next: {
    marker: "Lbr2zerj3WHNDsZ1NsdFj7NiigDlittVkGc7RmPjKF3"
  }
});
```


---

>title: example payload for section fields  
>tags: entity-storage, storage, app-storage, data-persistance  
>context: config/entities.json  
>content:

# example payload for section fields

In this example, a `location` section groups two fields and a sub-section.

```json
{
  "restaurants": {
    "fields": [
      {
        "name": "restaurant_name",
        "label": "Name",
        "type": "text",
        "required": true
      },
      {
        "name": "short_code",
        "label": "Short-Code",
        "type": "text",
        "filterable": true,
        "required": true
      },
      {
        "name": "location",
        "label": "Address",
        "type": "section",
        "fields": [
          { "name": "loc_pin", "label": "Google Maps Link", "type": "paragraph" },
          { "name": "loc_zipcode", "label": "Zipcode", "type": "text", "filterable": true }
        ]
      },
      {
        "name": "status",
        "label": "catalog_status",
        "type": "enum",
        "choices": [
          { "id": 1, "value": "Pending" },
          { "id": 2, "value": "In-progress" },
          { "id": 3, "value": "Cataloged" }
        ],
        "filterable": true
      }
    ]
  }
}
```

---
>title: Error responses for entity methods  
>tags: entity-storage, storage, app-storage, data-persistance  
>context:  
>content:

# Error responses for entity methods

If a call fails, you receive an error object:

```json
{
  "message": "Invalid input field",
  "status": 400,
  "errors": [
    { "message": "Field name should be of type string", "name": "label" }
  ],
  "errorSource": "APP"
}
```

## Attributes
- **message**: General error description.
- **status**: `HTTP` status code.
- **errors**: Array of validation issues (each has `message` and `name`).
- **errorSource**: `"APP"` or `"PLATFORM"`.


---

>title: how to test the app with entity storage locally  
>tags: entity-storage, storage, app-storage, data-persistance, test  
>context:  
>content:

# how to test the app with entity storage locally

## Steps
1. Run local server & validation:
   ```sh
   fdk run
   ```
2. Fix any schema errors; rerun to generate a `.sqlite` mimic DB.
3. Modify `entities.json`, rerun fdk run to sync.
4. Resync if prompted (deletes local entities & data).
5. Append `?dev=true` to your product URL to load the app.
6. Simulate record operations; `inspect`, `success` or `error` responses.

---

>title: how to retrieve or delete a record of an entity in a serverless app  
>tags: entity-storage, storage, app-storage, data-persistance  
>context: server.js  
>content:

# how to retrieve or delete a record of an entity in a serverless app

## Retrieve with `$and` Filter
```js
const data = await $entity.get("restaurants").getAll({
  query: {
    $and: [
      { loc_zipcode: "600123" },
      { short_code: "HT1" }
    ]
  },
  next: { marker: "Lbr2zerj3WHNDsZ1NsdFj7NiigDlittVkGc7RmPjKF3" }
});
```

## Delete a Record

```js
const record = await restaurant.delete("scshv-2");
```


---

>title: what is entity storage and how to delete a record of an entity from a frontend app  
>tags: entity-storage, storage, app-storage, data-persistance  
>context: app.js  
>content:

# what is entity storage and how to delete a record of an entity from a frontend app

Entity storage is a DB-like feature for custom objects in Freshworks apps.

## Delete a Record
```js
entReference.delete("<display-id>");
```

## Example in app.js

```js
restaurant.delete("scshv-2");
```


---

>title: how to create a record in serverless apps  
>tags: entity-storage, storage, app-storage, data-persistance  
>context: server.js  
>content:

# how to create a record in serverless apps

## Create a New Record
```js
const record = await $entity.get("<entity-name>")
  .create({
    <fields.name1>: "<value1>",
    <fields.name2>: "<value2>"
  });
```

## Retrieve All Records

```js
const records = await <entReference>.getAll({});
```


---

>title: What are the considerations for entity storage and how to delete entities  
>tags: entity-storage, storage, app-storage, data-persistance  
>context:  
>content:

# What are the considerations for entity storage and how to delete entities

## Considerations
1. **Pricing Plans:** Only available on Enterprise or Forest/Estate plans.  
2. **Entity Limits:** Max 5 entities per account; 20 fields per entity.  
3. **Record Limits:** Unlimited records; each ≤100 KB.  
4. **No Bulk Create:** Batch operations not supported.  
5. **Uninstall Behavior:** Removing the app deletes all entities and their data.

---