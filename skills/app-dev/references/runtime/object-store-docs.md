> title: What is Object store in Freshworks apps
> tags: object-store, file-store, upload-files
> context:
> content:

# What is Object store in Freshworks apps

Freshworks developer platform now supports Object store to allow developers to upload, retrieve, list, and delete files in a secure and scalable manner. This storage is accessible from both frontend and backend (Node.js using `fs-extra` or file streams). It is ideal for apps that require file uploads, attachments, or user-generated content.

---

> title: When can I use the Object store in Freshworks apps
> tags: object-store, file-storage, use-cases
> context:
> content:

# When can I use the Object store in Freshworks apps

Use Object store in your app when:

* You want to upload files through the UI (e.g., JSON files, spreadsheets, and images)
* You need to store and retrieve attachments in serverless logic
* You require file management capabilities (list, delete) for your app's users or data lifecycle

---

> title: How secure is the Object store in Freshworks apps
> tags: object-store, security, encryption
> context:
> content:

# How secure is the Object store in Freshworks apps

Files stored in the Object store are hosted in the Freshworks cloud and inherit the platform’s secure infrastructure. File access is scoped per app installation. Public access is not allowed. File content is securely stored at the same Freshworks developer platform cloud and encrypted in transit.

---

> title: How to upload files to Object store in Freshworks frontend apps
> tags: object-store, upload, formdata
> context: app.js
> content:

# How to upload files using FormData in frontend apps

You can use the following method to upload files from the browser:

```js
const formData = new FormData();
formData.append("file", fileInput.files[0].file);
formData.append("description", "string");
formData.append("tag", "string");
formData.append('filename', fileInput.files[0].name);

client.files.upload(formData).then(
  function(response) {
    // handle success case
  },
  function(error) {
    console.error("Upload failed", error);
  }
);
```

---

> title: How to upload files from serverless in Freshworks apps
> tags: object-store, upload, fs-extra
> context: server.js
> content:

# How to upload files using `fs-extra` in serverless backend

```js
const fs = require("fs-extra");

// Get Serverless app sandbox path
const sandboxPath = $files.getSandboxedPath();

// Create a sample file content
const csvData = [
  ['id', 'name', 'status'],
  ['1', 'Router A', 'Active'],
  ['2', 'Router B', 'Inactive'],
  ['3', 'Router C', 'Active']
].map(row => row.join(',')).join('\n');

// Write the file into the path
fs.writeFileSync(`${sandboxPath}/sample.csv`, csvData);

// Upload the file from the sandbox path
$files.upload({
  "file": `${sandboxPath}/sample.csv`,
  "description": "kyc approve document",
  "expires_at": "2019-01-29T13:07:32+05:30",
  "tag": "First-quarter"
 }).then(
  function(response) {
    // handle success case
  },
  function(error) {
    console.error("Upload failed", error);
  }
);
```

---

> title: How to retrieve, list, and delete files in Object store
> tags: object-store, retrieve, delete, list
> context: app.js, server.js
> content:

# How to retrieve, list, and delete files in Object store

These operations are available on the serverless with `$files` in place of `client.files`.

## Retrieve a file

To get a single file data:

```js
client.files.get(fileId).then(response => {
  // Access file metadata or URL
  console.log(response);
});
```

## List all files

To list all the files data:

```js
client.files.list().then(response => {
  // response.files is an array of file metadata
  console.log(response.files);
});
```

## Delete a file

Deleting multiple files is not possible. All the files will be deleted upon the app uninstallation.

To delete a single file:

```js
client.files.delete(fileId).then(response => {
  console.log("Deleted successfully");
});
```

---

> title: Object store considerations
> tags: object-store, limitations, rate-limits
> context:
> content:

# Object store considerations

The following limits and factors should be considered while using the Object store:
1. Files are scoped per account and app installation.
2. Maximum size per file is 10 MB. Maximum file storage per app installation per account is 100 MB and it can be extended upon request.
3. Allowed file types are PNG, JPG, JPEG, XLS, XLSX, CSV, and JSON.
4. Rate limit of 50 operations per minute (upload, get, delete, list). Reach out via Dev-assist portal for limit extension requests.
5. Files can be deleted automatically with `expires_at` attribute set.
6. Not intended for high-frequency or large file hosting.

---

> title: How to manage files using object store in Freshworks apps
> tags: object-store, file-upload, data-store
> context: app.js, server.js
> content:

# How to manage files using Object store in Freshworks apps

The Object Store in Freshworks allows apps to handle multimedia files—such as images, spreadsheets, and other data files—by providing functionalities to upload, retrieve, list, and delete files.

## Uploading Files

### From frontend apps

To upload a file from the frontend, you can use the `client.files.upload()` method with a `FormData` object:

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]); // fileInput is an <input type="file"> element
formData.append('description', 'This is a test file upload');

client.files.upload(formData).then(
  function (data) {
    // Success operation
    // "data" contains id of the uploaded file
  },
  function (error) {
    // Failure operation
    console.error(error);
  }
);
```

### From Serverless Apps

In serverless apps, you can use the `$files.upload()` method. To read files from the filesystem, you can utilize the `fs-extra` module:

```javascript
const fs = require("fs-extra");

// Get Serverless app sandbox path
const sandboxPath = $files.getSandboxedPath();

// Create a sample file content
const csvData = [
  ['id', 'name', 'status'],
  ['1', 'Router A', 'Active'],
  ['2', 'Router B', 'Inactive'],
].map(row => row.join(',')).join('\n');

// Write the file into the path
fs.writeFileSync(`${sandboxPath}/sample.csv`, csvData);

// Upload the file from the sandbox path
$files.upload({
  "file": `${sandboxPath}/sample.csv`,
  "description": "sample document"
 }).then(
  function(response) {
    // handle success case
  },
  function(error) {
    console.error("Upload failed", error);
  }
);
```

## Retrieving a File

### From frontend apps

To retrieve a file using its ID:

```javascript
client.files.get(fileId).then(
  function (data) {
    // Success operation
    // "data" contains the file's details and URL
  },
  function (error) {
    // Failure operation
    console.error(error);
  }
);
```

### From serverless apps

To retrieve a file using its ID:

```javascript
$files.get(fileId).then(
  function (data) {
    // Success operation
    // "data" contains the file's content
  },
  function (error) {
    // Failure operation
    console.error(error);
  }
);
```

## Listing All Files

### From frontend apps

To list all uploaded files:

```javascript
client.files.list().then(
  function (data) {
    // Success operation
    // "data" is an array of file metadata
  },
  function (error) {
    // Failure operation
    console.error(error);
  }
);
```

### From serverless apps

To list all uploaded files:

```javascript
$files.list().then(
  function (data) {
    // Success operation
    // "data" is an array of file metadata
  },
  function (error) {
    // Failure operation
    console.error(error);
  }
);
```

## Deleting a File

### From frontend apps

To delete a file using its ID:

```javascript
client.files.delete(fileId).then(
  function (data) {
    // Success operation
    // "data" confirms deletion
  },
  function (error) {
    // Failure operation
    console.error(error);
  }
);
```

### From serverless apps

To delete a file using its ID:

```javascript
$files.delete(fileId).then(
  function (data) {
    // Success operation
    // "data" confirms deletion
  },
  function (error) {
    // Failure operation
    console.error(error);
  }
);
```

---

>title: Consideration factors for using object store in Freshworks apps
>tags: object-store, files, rate-limit
>context:
>content:

## Considerations

1. Allowed file types: PNG, JPG, JPEG, XLS, XLSX, CSV, and JSON.
2. Maximum file size**: 10 MB per upload.
3. Naming constraints:
   * File name: 2–255 alphanumeric characters.
   * Tag name: Less than 50 alphanumeric characters.
   * Description: Less than 255 alphanumeric characters.
4. Storage limit: Maximum of 100 MB per app per account. To increase this limit, raise a ticket requesting for increased limit for the account.
5. Rate limits: A rate limit of 50 requests per minute applies, with each upload, get, list, and delete counting as one request.

---

>title: What are the operations that can be performed on the object store
>tags: object-store, files, upload
>context: app.js, server.js
>content:

# What are the operations that can be performed on the Object store

The following operations can be performed in the Object store:
1. Upload - `client.files.upload(Formdata)` in front-end apps and `$files.upload({ file: file_sandbox_path})` in serverless apps
2. Get - `client.files.get(fileId)` in front-end apps and `$files.get(fileId)` in serverless apps
3. List - `client.files.list()` in front-end apps and `$files.list()` in serverless apps
4. Delete - `client.files.delete(fileId)` in front-end apps and `$files.delete(fileId)` in serverless apps

---

>title: How to set auto expiry when uploading files with object store
>tags: object-store, files, expiry, ttl
>context: app.js, server.js
>code:

# How to set auto expiry when uploading files with object store

The expires_at attribute specifies the expiration period of the key in the object store in the ISO8601 format. If you do not set the expires_at value, the file will exist forever until deleted manually or the app is uninstalled.

Here's some sample code that includes ttl for app.js:

## Using expires_at attribute while uploading files in frontend apps

```js
const formData = new FormData();
formData.append("file", fileInput.files[0].file);
formData.append("expires_at", "2025-12-30T00:00:01+05:30");

client.files.upload(formData).then(
  function(response) {
    // handle success case
  },
  function(error) {
    console.error("Upload failed", error);
  }
);
```

## Using expires_at attribute while uploading files in serverless apps

```js
const fs = require("fs-extra");

// Get Serverless app sandbox path
const sandboxPath = $files.getSandboxedPath();

// Create a sample file content
const csvData = [
  ['id', 'name', 'status'],
  ['1', 'Router A', 'Active'],
  ['2', 'Router B', 'Inactive'],
].map(row => row.join(',')).join('\n');

// Write the file into the path
fs.writeFileSync(`${sandboxPath}/sample.csv`, csvData);

// Upload the file from the sandbox path
$files.upload({
  "file": `${sandboxPath}/sample.csv`,
  "expires_at": "2025-12-30T00:00:01+05:30"
 }).then(
  function(response) {
    // handle success case
  },
  function(error) {
    console.error("Upload failed", error);
  }
);
```

---
