>title: What is Jobs feature
>tags: jobs
>context: server.js, manifest.json, app.js
>content:

# What is Jobs feature

The Jobs feature allows you to run asynchronous background tasks from the front-end component. Jobs are suitable for long-running processes like API calls, data processing, or background sync that do not require an immediate response.

You can implement the job feature in three steps:

1. Define the job in the manifest.json.
2. Trigger the job from the iparam or frontend app.
3. Export the job logic function in the serverless app.

Check [the documentation](https://developers.freshworks.com/docs/app-sdk/v3.0/common/serverless-apps/jobs/) for more details.

---

>title: What are the limitations with Jobs feature
>tags: jobs
>context: server.js, manifest.json, app.js
>content:

# What are the limitations with Jobs feature:

These are the limitations to consider while using the jobs feature:

1. Jobs can run for a maximum duration of 2 minutes.
2. By default, a maximum 15 jobs can run concurrently.
3. Jobs are asynchronous and do not return a response back using `renderData()`.
4. To check the status of a job, use `client.job.get('job_id')`.
5. Use `$job.updateStatusMessage("message")` within the job function to share real-time progress. This message is overridden once the job completes.
6. Another job cannot be triggered from the job function. Use events or scheduling from the frontend for chain of jobs.
7. It is not possible to cancel a running job.

---

>title: How to configure and use the job function?
>tags: jobs
>context: server.js, manifest.json, app.js
>content:

# How to configure and use a Job function in your Freshworks app

To run long-running background tasks asynchronously, use the Jobs feature. This guide walks you through registering, triggering, and implementing a Job using `manifest.json`, `app.js`, and `server.js`.

## Step 1: Register and trigger a Job

Start by updating `manifest.json` to declare the Job:

```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "jobs": {
        "sample_job": {}
      }
    }
  }
}
```

Next, use the Freshworks client API in app.js to trigger the Job:

```js
client.job.invoke("sample_job", "some_tag", {
  ticketId: 12345
}).then(function(jobId) {
  console.log("Job triggered:", jobId);
});
```

This allows the frontend to kick off background processing.

## Step 2: Implement the Job logic

In server.js, define the job function to run asynchronously. You can also update its status during execution. The Job logic runs independently of the UI, making it ideal for heavy processing.

```js
exports.sample_job = async function(args) {
  await $job.updateStatusMessage("Started processing...");
  // Business logic here
  await $job.updateStatusMessage("Done!");
};
```

---

>title: Syntax of JSON payload for Jobs in Freshworks apps
>tags: serverless-offerings, jobs
>context: server.js, manifest.json, app.js
>content:

# Syntax of JSON Payload for Jobs in Freshworks apps

Freshworks apps support Jobs to perform long-running or backend tasks asynchronously. A typical job is triggered from the frontend (`app.js`) and handled in the backend (`server.js`). This guide walks through the structure and flow of the JSON payload used when triggering and handling a job.

## Step 1: Triggering a Job in `app.js`

To initiate a job from the frontend, use the `client.job.invoke()` method. This method sends a JSON payload containing relevant data to the backend job defined in your app's `manifest.json`.

Here’s an example of how you can trigger a job named `longRunningTask` from `app.js`:

```js
client.job.invoke("longRunningTask", {
  ticket_id: 1
});
```

In the above example, the app triggers the longRunningTask job and sends the ticket_id as input. This job name must match the one defined in the manifest.json.

### Step 2: Receiving the Payload in `server.js`

On the backend, the corresponding job function for `longRunningTask` receives the JSON payload sent from `app.js`. The Freshworks platform enriches this payload by including additional context such as `iparams`, which contains installation parameters like API keys.

Below is an example of the full JSON structure received in `server.js`:

```json
{
  "ticket_id": 1,
  "iparams": {
    "api_key": "your_api_key"
  }
}
```

This backend payload:

* Includes the `ticket_id` originally passed from `app.js`
* Adds `iparams`, which are securely stored and managed via the app configuration
* Is automatically parsed and passed into the job handler function by the Freshworks runtime

Understanding both sides—how the job is triggered in `app.js` and how the payload is received in `server.js`—ensures a consistent and functional integration using the Jobs feature in your Freshworks app.

### Key Points for Payload Consistency

* The payload in `app.js` should include all required keys expected by the backend.
* Ensure the job name in `client.job.invoke()` matches the one declared in `manifest.json`.
* Always test your job with sample payloads to confirm correct delivery and parsing.

---

>title: How to check status of a Job
>tags: serverless-offerings, jobs
>context: app.js
>content:

# How to check status of a Job

1. Use `client.job.get("jobId")` to fetch job status.
2. The returned object contains `id`, `name`, `tag`, `start_time`, `end_time`, `status`, and `status_message`. The `end_time` attribute is included in the response upon job completion with success or failure.
3. It has a overall jobs rate limit of 50 requests per minute but can be increased on a case-by-case basis via Dev Assist.

```js
client.job.get("jobId12345")
  .then(response =>console.log("Job:", response))
  .catch(error =>console.error("Status fetch failed", error));
```

---

>title: How to update status message from a Job
>tags: serverless-offerings, jobs
>context: server.js
>content:

# How to update status message from a Job

1. Use `$job.updateStatusMessage("message")` within the job function.
2. The status is `in-progress` when the app updates the status message.
2. Status messages help track progress from the UI. The status gets updated automatically to `success`, `failed`, or `timeout` based on it's status upon the job completion or timeout.
3. Final message will automatically replace the last updated status.

```js
exports = {
  longRunningTask: async function(payload) {
    await $job.updateStatusMessage("Downloading file...");
    await downloadFile(payload.url);
    await $job.updateStatusMessage("Processing data...");
    await processData();
  }
};
```

---

>title: Jobs use-cases
>tags: serverless-offerings, jobs
>context: server.js, manifest.json, app.js
>content:

# Job use-cases

1. Handling long-running tasks like report generation, file parsing.
2. Background data synchronisation.
3. Fetching external data from slow APIs.
4. Processing complex business logic asynchronously.

---

>title: Using third-party or npm libraries with Jobs
>tags: serverless-offerings, jobs
>context: server.js, manifest.json
>content:

# Using third-party or npm libraries with Job

1. Declare required npm libraries in `manifest.json`.
2. Run `fdk run` to install dependencies locally.
3. Import and use the library inside the Job function.

```json
"dependencies": {
  "axios": "1.7.5"
}
```

```js
import axios from "axios";

exports = {
  longRunningTask: async function(payload) {
    let response = await axios.get(payload.url);
    await $job.updateStatusMessage("Data fetched");
  }
};
```

---

>title: Adding logs to Job functions
>tags: serverless-offerings, jobs
>context: server.js
>content:

# Adding logs to Job functions

1. Use `console.log`, `console.info`, `console.error` in the Job function.
2. Logs are viewable via local `fdk run` or in the Freshworks app logs after installation.
3. You can also send the error for the job with `$job.updateStatusMessage("Processing data...")` method to the frontend.

---

>title: Viewing Job logs in your Freshworks account
>tags: serverless-offerings, jobs
>context: server.js
>content:

# Viewing Job logs in your Freshworks account

1. Go to `Manage Apps >Custom Apps`.
2. Click `Settings` next to your app.
3. Under the `Logs` tab, view messages logged during Job execution.
4. You can also view the error from the job with `client.job.get('job_id')` method.

---

>title: Viewing Job logs locally during app development
>tags: serverless-offerings, jobs
>context: server.js
>content:

# Viewing Job logs locally during app development

Steps to view the logs in the local environment:

1. Run the app locally using `fdk run`.
2. Trigger the Job from `app.js`.
3. Any `console` statements will appear in your terminal running the local server.

---

>title: Example use case for Jobs in Freshworks apps
>tags: serverless, jobs
>context:
>content:

# How to use Jobs feature in Freshworks apps

The Jobs feature enables asynchronous backend processing in Freshworks applications, ideal for time-intensive operations like external API calls and data synchronization. This guide demonstrates implementing Jobs through a GitHub user synchronization example.

## Jobs Feature Overview

Jobs operate through a three-step process: declaring jobs in manifest.json, invoking jobs from the frontend, and processing jobs in the backend. This architecture ensures reliable asynchronous processing while maintaining application responsiveness.

The Jobs feature handles operations that exceed typical request timeouts, such as slow external API integrations and bulk data processing. Jobs run independently of the user interface, preventing blocking operations and improving user experience.

Our implementation synchronizes GitHub user data with Freshservice requesters using the complete Jobs workflow. Each step connects to create a seamless asynchronous processing system from job registration through execution and result handling.

## Step 1: Job Declaration in manifest.json

Register jobs in the manifest.json jobs section to establish the foundation for asynchronous processing. Job declaration creates platform-recognized endpoints with configurable parameters.
The `syncGitHubUser` job declaration registers the job name with the platform and sets execution timeout limits. This registration enables the platform to route job requests properly and manage resource allocation.

```json
{
  "platform-version": "3.0",
  "common": {
    "jobs": {
      "syncGitHubUser": {
        "timeout": 15
      }
    }
  }
}
```

## Step 2: Frontend Job Invocation in app.js

Use `client.jobs.invoke()` to trigger registered jobs from the frontend, creating the bridge between user actions and backend processing. Job invocation includes job identification, instance tracking, and payload data transfer.
The invoke method accepts the job name from manifest.json, a unique tracking identifier, and payload data for the backend function. Promise-based handling manages both successful completion and error scenarios with appropriate user feedback.


```js
function triggerGitHubSync() {
  client.jobs.invoke("syncGitHubUser", "github_tag", {})
    .then(response => console.log("Sync Success:", response))
    .catch(error => console.error("Sync Failed:", error));
}
```

## Step 3: Backend Job Processing in server.js

Implement job logic through exported functions in server.js that handle the actual asynchronous processing. Job functions execute the core business logic including external API calls and data operations.
The job function uses async/await patterns for external API calls and includes comprehensive error handling. The implementation fetches GitHub data, processes it for Freshservice integration, and returns appropriate success or error responses through renderData.

```js
exports = {
  syncGitHubUser: async function (args) {
    try {
      const githubUser = await getGitHubUserData();
      console.log("GitHub User Data:", githubUser.response);
      
      await createFreshserviceRequester();
      renderData(null, { message: "GitHub user synced successfully." });
    } catch (error) {
      console.error("Error syncing GitHub user:", error);
      renderData(error, null);
    }
  }
};
```
---
