# API Integration Examples

**Complete guide for external API integrations in Platform 3.0 apps.**

**Auth & third-party docs:** For **OAuth** providers, use `oauth_config.json` + `<%= access_token %>` + `"options": { "oauth": "..." }` on the template (see `references/architecture/oauth-configuration-latest.md`). **Do not** ship new apps that put long-lived Google/Microsoft **user** tokens only in iparams as `Bearer <%= iparam... %>` when account OAuth is available. **API keys, Slack bot tokens, Stripe secrets, and fixed webhooks** in **secure iparams** are still valid where OAuth is not applicable. For **scopes, redirect URIs, Sheets range encoding, Graph vs Sheets paths**, and other vendor details **not** fully enumerated here, use **web search** against the **official** vendor documentation, then encode results into request templates.

## Table of Contents
1. [Common Request Schema Patterns](#common-request-schema-patterns)
2. [Error Handling Patterns](#error-handling-patterns)
3. [Authentication Patterns](#authentication-patterns)
4. [Real-World Integrations](#real-world-integrations)
5. [Common Mistakes & Fixes](#common-mistakes--fixes)

---

## Common Request Schema Patterns

### 1. Pagination Handling

#### Offset-Based Pagination
```json
// config/requests.json
{
  "getUsers": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v1/users",
      "query": {
        "limit": "100",
        "offset": "<%= context.offset %>"
      },
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>"
      }
    }
  }
}
```

```javascript
// server/server.js
exports = {
  fetchAllUsers: async function(args) {
    const allUsers = [];
    let offset = 0;
    const limit = 100;

    try {
      while (true) {
        const response = await $request.invokeTemplate('getUsers', {
          context: { offset: offset }
        });

        const data = JSON.parse(response.response);
        allUsers.push(...data.users);

        if (data.users.length < limit) break;
        offset += limit;
      }

      renderData(null, { users: allUsers, total: allUsers.length });
    } catch (error) {
      console.error('[fetchAllUsers] Error:', error.message);
      renderData({ status: 500, message: 'Failed to fetch users' });
    }
  }
};
```

#### Cursor-Based Pagination
```json
// config/requests.json
{
  "getTickets": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v2/tickets",
      "query": {
        "cursor": "<%= context.cursor %>",
        "per_page": "50"
      },
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>"
      }
    }
  }
}
```

```javascript
// server/server.js
exports = {
  fetchTicketsWithCursor: async function(args) {
    const allTickets = [];
    let cursor = null;

    try {
      do {
        const response = await $request.invokeTemplate('getTickets', {
          context: { cursor: cursor || '' }
        });

        const data = JSON.parse(response.response);
        allTickets.push(...data.tickets);
        cursor = data.next_cursor;

      } while (cursor);

      renderData(null, { tickets: allTickets, count: allTickets.length });
    } catch (error) {
      console.error('[fetchTicketsWithCursor] Error:', error.message);
      renderData({ status: 500, message: error.message });
    }
  }
};
```

#### Page-Based Pagination
```json
// config/requests.json
{
  "getContacts": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/contacts",
      "query": {
        "page": "<%= context.page %>",
        "per_page": "100"
      },
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>"
      }
    }
  }
}
```

```javascript
// server/server.js
exports = {
  fetchContactsByPage: async function(args) {
    const allContacts = [];
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await $request.invokeTemplate('getContacts', {
          context: { page: page }
        });

        const data = JSON.parse(response.response);
        allContacts.push(...data.contacts);

        hasMore = data.contacts.length === 100;
        page++;
      }

      renderData(null, { contacts: allContacts });
    } catch (error) {
      console.error('[fetchContactsByPage] Error:', error.message);
      renderData({ status: 500, message: error.message });
    }
  }
};
```

### 2. Rate Limiting & Retry with Exponential Backoff

```json
// config/requests.json
{
  "createTicket": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "api.example.com",
      "path": "/v1/tickets",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>",
        "Content-Type": "application/json"
      }
    },
    "options": {
      "maxAttempts": 3,
      "retryDelay": 1000
    }
  }
}
```

```javascript
// server/server.js
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;
      const isRateLimited = error.status === 429;

      if (isLastAttempt || !isRateLimited) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`[Retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

exports = {
  createTicketWithRetry: async function(args) {
    try {
      const result = await retryWithBackoff(async () => {
        return await $request.invokeTemplate('createTicket', {
          body: JSON.stringify({
            subject: args.subject,
            description: args.description,
            priority: args.priority
          })
        });
      });

      renderData(null, { success: true, data: JSON.parse(result.response) });
    } catch (error) {
      console.error('[createTicketWithRetry] Failed after retries:', error.message);
      renderData({ status: 500, message: 'Failed after multiple attempts' });
    }
  }
};
```

### 3. Batch Requests

```json
// config/requests.json
{
  "batchUpdate": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "api.example.com",
      "path": "/v1/batch",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

```javascript
// server/server.js
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

exports = {
  batchUpdateRecords: async function(args) {
    const { records } = args;
    const batchSize = 100;
    const batches = chunkArray(records, batchSize);
    const results = [];

    try {
      for (let i = 0; i < batches.length; i++) {
        console.info(`[batchUpdate] Processing batch ${i + 1}/${batches.length}`);

        const response = await $request.invokeTemplate('batchUpdate', {
          body: JSON.stringify({ records: batches[i] })
        });

        results.push(JSON.parse(response.response));
      }

      renderData(null, {
        success: true,
        batches: batches.length,
        results: results
      });
    } catch (error) {
      console.error('[batchUpdateRecords] Error:', error.message);
      renderData({ status: 500, message: error.message });
    }
  }
};
```

### 4. Webhook Verification

```json
// config/requests.json
{
  "verifyWebhook": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "api.example.com",
      "path": "/webhooks/verify",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

```javascript
// server/server.js
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

exports = {
  handleWebhook: async function(args) {
    const { payload, signature } = args;
    const secret = args.iparams.webhook_secret;

    try {
      if (!verifyWebhookSignature(JSON.stringify(payload), signature, secret)) {
        console.error('[handleWebhook] Invalid signature');
        renderData({ status: 401, message: 'Invalid signature' });
        return;
      }

      console.info('[handleWebhook] Signature verified');

      // Process webhook payload
      const response = await $request.invokeTemplate('verifyWebhook', {
        body: JSON.stringify(payload)
      });

      renderData(null, { success: true, data: JSON.parse(response.response) });
    } catch (error) {
      console.error('[handleWebhook] Error:', error.message);
      renderData({ status: 500, message: error.message });
    }
  }
};
```

### 5. File Upload

```json
// config/requests.json
{
  "uploadFile": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "api.example.com",
      "path": "/v1/files",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>",
        "Content-Type": "multipart/form-data"
      }
    }
  }
}
```

```javascript
// server/server.js
exports = {
  uploadDocument: async function(args) {
    const { fileName, fileContent, fileType } = args;

    try {
      const formData = {
        file: {
          value: Buffer.from(fileContent, 'base64'),
          options: {
            filename: fileName,
            contentType: fileType
          }
        }
      };

      const response = await $request.invokeTemplate('uploadFile', {
        body: formData
      });

      const data = JSON.parse(response.response);
      console.info('[uploadDocument] File uploaded:', data.file_id);

      renderData(null, { success: true, fileId: data.file_id });
    } catch (error) {
      console.error('[uploadDocument] Upload failed:', error.message);
      renderData({ status: 500, message: 'File upload failed' });
    }
  }
};
```

### 6. File Download

```json
// config/requests.json
{
  "downloadFile": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v1/files/<%= context.file_id %>",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>"
      }
    }
  }
}
```

```javascript
// server/server.js
exports = {
  downloadDocument: async function(args) {
    const { fileId } = args;

    try {
      const response = await $request.invokeTemplate('downloadFile', {
        context: { file_id: fileId }
      });

      // Response contains binary data
      const fileBuffer = Buffer.from(response.response, 'binary');
      const base64Content = fileBuffer.toString('base64');

      renderData(null, {
        success: true,
        content: base64Content,
        size: fileBuffer.length
      });
    } catch (error) {
      console.error('[downloadDocument] Download failed:', error.message);
      renderData({ status: 500, message: 'File download failed' });
    }
  }
};
```

---

## Error Handling Patterns

### 1. HTTP Status Code Handling

```javascript
// server/server.js
function handleHttpError(error, operation) {
  const statusCode = error.status || 500;

  const errorMap = {
    400: { message: 'Bad request - check your parameters', retry: false },
    401: { message: 'Unauthorized - check your API key', retry: false },
    403: { message: 'Forbidden - insufficient permissions', retry: false },
    404: { message: 'Resource not found', retry: false },
    429: { message: 'Rate limit exceeded - retry later', retry: true },
    500: { message: 'Server error - retry later', retry: true },
    502: { message: 'Bad gateway - service unavailable', retry: true },
    503: { message: 'Service unavailable - retry later', retry: true },
    504: { message: 'Gateway timeout - retry later', retry: true }
  };

  const errorInfo = errorMap[statusCode] || {
    message: 'Unknown error occurred',
    retry: false
  };

  console.error(`[${operation}] HTTP ${statusCode}: ${errorInfo.message}`);

  return {
    status: statusCode,
    message: errorInfo.message,
    canRetry: errorInfo.retry,
    operation: operation
  };
}

exports = {
  fetchDataWithErrorHandling: async function(args) {
    try {
      const response = await $request.invokeTemplate('getData', {
        context: { id: args.id }
      });

      renderData(null, { success: true, data: JSON.parse(response.response) });
    } catch (error) {
      const errorDetails = handleHttpError(error, 'fetchData');
      renderData(errorDetails);
    }
  }
};
```

### 2. Network Timeout Handling

```json
// config/requests.json
{
  "slowApi": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "slow-api.example.com",
      "path": "/data",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>"
      }
    },
    "options": {
      "timeout": 30000,
      "maxAttempts": 2,
      "retryDelay": 2000
    }
  }
}
```

```javascript
// server/server.js
exports = {
  fetchWithTimeout: async function(args) {
    const timeoutMs = 25000;

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
      });

      const requestPromise = $request.invokeTemplate('slowApi', {
        context: {}
      });

      const response = await Promise.race([requestPromise, timeoutPromise]);

      renderData(null, { success: true, data: JSON.parse(response.response) });
    } catch (error) {
      if (error.message === 'Request timeout') {
        console.error('[fetchWithTimeout] Request exceeded timeout');
        renderData({ status: 504, message: 'Request timeout - try again' });
      } else {
        console.error('[fetchWithTimeout] Error:', error.message);
        renderData({ status: 500, message: error.message });
      }
    }
  }
};
```

### 3. Malformed Response Handling

```javascript
// server/server.js
function parseJsonSafely(responseString, operation) {
  try {
    return JSON.parse(responseString);
  } catch (error) {
    console.error(`[${operation}] Invalid JSON response:`, error.message);
    throw new Error('Invalid response format from API');
  }
}

function validateResponseSchema(data, requiredFields, operation) {
  for (const field of requiredFields) {
    if (!(field in data)) {
      console.error(`[${operation}] Missing required field: ${field}`);
      throw new Error(`Invalid response: missing ${field}`);
    }
  }
  return true;
}

exports = {
  fetchValidatedData: async function(args) {
    try {
      const response = await $request.invokeTemplate('getData', {
        context: { id: args.id }
      });

      const data = parseJsonSafely(response.response, 'fetchValidatedData');

      validateResponseSchema(data, ['id', 'name', 'status'], 'fetchValidatedData');

      renderData(null, { success: true, data: data });
    } catch (error) {
      console.error('[fetchValidatedData] Validation error:', error.message);
      renderData({ status: 500, message: error.message });
    }
  }
};
```

### 4. API Versioning Issues

```json
// config/requests.json
{
  "getDataV2": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v2/data/<%= context.id %>",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>",
        "Accept": "application/vnd.api.v2+json"
      }
    }
  },
  "getDataV1Fallback": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v1/data/<%= context.id %>",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>",
        "Accept": "application/json"
      }
    }
  }
}
```

```javascript
// server/server.js
exports = {
  fetchWithVersionFallback: async function(args) {
    try {
      // Try v2 API first
      const response = await $request.invokeTemplate('getDataV2', {
        context: { id: args.id }
      });

      const data = JSON.parse(response.response);
      console.info('[fetchWithVersionFallback] Using API v2');

      renderData(null, { success: true, data: data, version: 'v2' });
    } catch (error) {
      if (error.status === 404 || error.status === 410) {
        console.warn('[fetchWithVersionFallback] v2 unavailable, falling back to v1');

        try {
          const fallbackResponse = await $request.invokeTemplate('getDataV1Fallback', {
            context: { id: args.id }
          });

          const data = JSON.parse(fallbackResponse.response);
          renderData(null, { success: true, data: data, version: 'v1' });
        } catch (fallbackError) {
          console.error('[fetchWithVersionFallback] Both versions failed');
          renderData({ status: 500, message: 'API unavailable' });
        }
      } else {
        console.error('[fetchWithVersionFallback] Error:', error.message);
        renderData({ status: error.status || 500, message: error.message });
      }
    }
  }
};
```

---

## Authentication Patterns

### 1. API Key in Header

```json
// config/requests.json
{
  "getDataWithApiKey": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v1/data",
      "headers": {
        "X-API-Key": "<%= iparam.api_key %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

```json
// config/iparams.json
{
  "api_key": {
    "display_name": "API Key",
    "description": "Your API key from example.com",
    "type": "text",
    "required": true,
    "secure": true
  }
}
```

### 2. API Key in Query Parameter

```json
// config/requests.json
{
  "getDataWithQueryKey": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v1/data",
      "query": {
        "api_key": "<%= iparam.api_key %>",
        "format": "json"
      }
    }
  }
}
```

### 3. Basic Authentication

```json
// config/requests.json
{
  "getDataWithBasicAuth": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v1/data",
      "headers": {
        "Authorization": "Basic <%= context.basic_auth %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

```javascript
// server/server.js
exports = {
  fetchWithBasicAuth: async function(args) {
    const username = args.iparams.username;
    const password = args.iparams.password;
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');

    try {
      const response = await $request.invokeTemplate('getDataWithBasicAuth', {
        context: { basic_auth: credentials }
      });

      renderData(null, { success: true, data: JSON.parse(response.response) });
    } catch (error) {
      console.error('[fetchWithBasicAuth] Error:', error.message);
      renderData({ status: 500, message: error.message });
    }
  }
};
```

### 4. Bearer Token (OAuth 2.0)

```json
// config/requests.json
{
  "getDataWithBearer": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v1/data",
      "headers": {
        "Authorization": "Bearer <%= iparam.access_token %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

### 5. Custom Auth Headers

```json
// config/requests.json
{
  "getDataWithCustomAuth": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v1/data",
      "headers": {
        "X-Auth-Token": "<%= iparam.auth_token %>",
        "X-Account-ID": "<%= iparam.account_id %>",
        "X-Signature": "<%= context.signature %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

```javascript
// server/server.js
const crypto = require('crypto');

function generateSignature(accountId, authToken, timestamp) {
  const data = `${accountId}:${timestamp}`;
  return crypto.createHmac('sha256', authToken).update(data).digest('hex');
}

exports = {
  fetchWithCustomAuth: async function(args) {
    const timestamp = Date.now();
    const signature = generateSignature(
      args.iparams.account_id,
      args.iparams.auth_token,
      timestamp
    );

    try {
      const response = await $request.invokeTemplate('getDataWithCustomAuth', {
        context: { signature: signature }
      });

      renderData(null, { success: true, data: JSON.parse(response.response) });
    } catch (error) {
      console.error('[fetchWithCustomAuth] Error:', error.message);
      renderData({ status: 500, message: error.message });
    }
  }
};
```

### 6. Token Refresh Pattern

```json
// config/requests.json
{
  "getData": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v1/data",
      "headers": {
        "Authorization": "Bearer <%= context.access_token %>"
      }
    }
  },
  "refreshToken": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "api.example.com",
      "path": "/oauth/token",
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  }
}
```

```javascript
// server/server.js
let cachedAccessToken = null;
let tokenExpiry = null;

async function getValidAccessToken(refreshToken) {
  const now = Date.now();

  if (cachedAccessToken && tokenExpiry && now < tokenExpiry) {
    return cachedAccessToken;
  }

  console.info('[getValidAccessToken] Refreshing token');

  const response = await $request.invokeTemplate('refreshToken', {
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`
  });

  const data = JSON.parse(response.response);
  cachedAccessToken = data.access_token;
  tokenExpiry = now + (data.expires_in * 1000);

  return cachedAccessToken;
}

exports = {
  fetchWithTokenRefresh: async function(args) {
    try {
      const accessToken = await getValidAccessToken(args.iparams.refresh_token);

      const response = await $request.invokeTemplate('getData', {
        context: { access_token: accessToken }
      });

      renderData(null, { success: true, data: JSON.parse(response.response) });
    } catch (error) {
      if (error.status === 401) {
        cachedAccessToken = null;
        tokenExpiry = null;
        console.error('[fetchWithTokenRefresh] Token refresh failed');
      }
      renderData({ status: 500, message: error.message });
    }
  }
};
```

### 7. Multiple Auth Methods in One App

```json
// config/requests.json
{
  "getFromServiceA": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "service-a.example.com",
      "path": "/api/data",
      "headers": {
        "Authorization": "Bearer <%= iparam.service_a_token %>"
      }
    }
  },
  "getFromServiceB": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "service-b.example.com",
      "path": "/api/data",
      "query": {
        "apikey": "<%= iparam.service_b_key %>"
      }
    }
  },
  "getFromServiceC": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "service-c.example.com",
      "path": "/api/data",
      "headers": {
        "X-API-Key": "<%= iparam.service_c_key %>",
        "X-Secret": "<%= iparam.service_c_secret %>"
      }
    }
  }
}
```

```javascript
// server/server.js
exports = {
  aggregateFromMultipleServices: async function(args) {
    try {
      const [responseA, responseB, responseC] = await Promise.all([
        $request.invokeTemplate('getFromServiceA', { context: {} }),
        $request.invokeTemplate('getFromServiceB', { context: {} }),
        $request.invokeTemplate('getFromServiceC', { context: {} })
      ]);

      const dataA = JSON.parse(responseA.response);
      const dataB = JSON.parse(responseB.response);
      const dataC = JSON.parse(responseC.response);

      renderData(null, {
        success: true,
        data: {
          serviceA: dataA,
          serviceB: dataB,
          serviceC: dataC
        }
      });
    } catch (error) {
      console.error('[aggregateFromMultipleServices] Error:', error.message);
      renderData({ status: 500, message: 'Failed to fetch from services' });
    }
  }
};
```

---

## Real-World Integrations

### 1. GitHub API - Get Repository Issues

```json
// config/requests.json
{
  "getGitHubIssues": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.github.com",
      "path": "/repos/<%= context.owner %>/<%= context.repo %>/issues",
      "query": {
        "state": "<%= context.state %>",
        "per_page": "100"
      },
      "headers": {
        "Authorization": "Bearer <%= iparam.github_token %>",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Freshworks-App"
      }
    }
  },
  "createGitHubIssue": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "api.github.com",
      "path": "/repos/<%= context.owner %>/<%= context.repo %>/issues",
      "headers": {
        "Authorization": "Bearer <%= iparam.github_token %>",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Freshworks-App",
        "Content-Type": "application/json"
      }
    }
  }
}
```

```javascript
// server/server.js
exports = {
  syncTicketToGitHub: async function(args) {
    const { ticketId, ticketSubject, ticketDescription } = args.data.ticket;

    try {
      const response = await $request.invokeTemplate('createGitHubIssue', {
        context: {
          owner: args.iparams.github_owner,
          repo: args.iparams.github_repo
        },
        body: JSON.stringify({
          title: `[Ticket #${ticketId}] ${ticketSubject}`,
          body: ticketDescription,
          labels: ['freshdesk-sync']
        })
      });

      const issue = JSON.parse(response.response);
      console.info('[syncTicketToGitHub] Created issue:', issue.number);

      renderData(null, {
        success: true,
        issueNumber: issue.number,
        issueUrl: issue.html_url
      });
    } catch (error) {
      console.error('[syncTicketToGitHub] Error:', error.message);
      renderData({ status: 500, message: 'Failed to create GitHub issue' });
    }
  }
};
```

### 2. Slack API - Send Message

```json
// config/requests.json
{
  "sendSlackMessage": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "slack.com",
      "path": "/api/chat.postMessage",
      "headers": {
        "Authorization": "Bearer <%= iparam.slack_bot_token %>",
        "Content-Type": "application/json"
      }
    }
  },
  "getSlackChannels": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "slack.com",
      "path": "/api/conversations.list",
      "query": {
        "types": "public_channel,private_channel"
      },
      "headers": {
        "Authorization": "Bearer <%= iparam.slack_bot_token %>"
      }
    }
  }
}
```

```javascript
// server/server.js
exports = {
  notifySlackOnTicket: async function(args) {
    const { ticket } = args.data;

    try {
      const message = {
        channel: args.iparams.slack_channel_id,
        text: `New ticket created: #${ticket.id}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*New Ticket Created*\n*Subject:* ${ticket.subject}\n*Priority:* ${ticket.priority}\n*Requester:* ${ticket.requester.name}`
            }
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: 'View Ticket' },
                url: `https://your-domain.freshdesk.com/a/tickets/${ticket.id}`
              }
            ]
          }
        ]
      };

      const response = await $request.invokeTemplate('sendSlackMessage', {
        body: JSON.stringify(message)
      });

      const data = JSON.parse(response.response);
      console.info('[notifySlackOnTicket] Message sent:', data.ts);

      renderData(null, { success: true, messageId: data.ts });
    } catch (error) {
      console.error('[notifySlackOnTicket] Error:', error.message);
      renderData({ status: 500, message: 'Failed to send Slack message' });
    }
  }
};
```

### 3. Google Sheets API (account OAuth — no iparam Bearer)

**[DEPRECATED for new apps]** Storing `Authorization: Bearer <%= iparam.google_access_token %>` in request templates bypasses Platform account OAuth and drifts from marketplace security expectations.

**Platform 3.0 pattern:** Register Google OAuth in `config/oauth_config.json` (`integrations`), add request templates with:

- `"Authorization": "Bearer <%= access_token %>"`
- Per-template `"options": { "oauth": "<your_integration_name>" }`

Use `context` for `spreadsheet_id`, `range`, etc. Invoke with `$request.invokeTemplate('writeGoogleSheet', { context: { ... }, body: JSON.stringify({ values: [...] }) })`.

**Operational details (ranges, `valueInputOption`, sheet names with spaces/special characters):** not duplicated here — use **web search** on official Google Sheets / Google OAuth documentation and mirror the current API paths and query parameters in `config/requests.json`.

### 4. Stripe API - Create Payment

```json
// config/requests.json
{
  "createStripePayment": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "api.stripe.com",
      "path": "/v1/payment_intents",
      "headers": {
        "Authorization": "Bearer <%= iparam.stripe_secret_key %>",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  },
  "getStripePayment": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.stripe.com",
      "path": "/v1/payment_intents/<%= context.payment_id %>",
      "headers": {
        "Authorization": "Bearer <%= iparam.stripe_secret_key %>"
      }
    }
  }
}
```

```javascript
// server/server.js
exports = {
  createPaymentIntent: async function(args) {
    const { amount, currency, customerId } = args;

    try {
      const body = new URLSearchParams({
        amount: amount,
        currency: currency,
        customer: customerId,
        'metadata[ticket_id]': args.ticketId
      }).toString();

      const response = await $request.invokeTemplate('createStripePayment', {
        body: body
      });

      const payment = JSON.parse(response.response);
      console.info('[createPaymentIntent] Payment created:', payment.id);

      renderData(null, {
        success: true,
        paymentId: payment.id,
        clientSecret: payment.client_secret
      });
    } catch (error) {
      console.error('[createPaymentIntent] Error:', error.message);
      renderData({ status: 500, message: 'Failed to create payment' });
    }
  }
};
```

### 5. Twilio API - Send SMS

```json
// config/requests.json
{
  "sendTwilioSMS": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "api.twilio.com",
      "path": "/2010-04-01/Accounts/<%= iparam.twilio_account_sid %>/Messages.json",
      "headers": {
        "Authorization": "Basic <%= context.basic_auth %>",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  }
}
```

```javascript
// server/server.js
exports = {
  sendSMSNotification: async function(args) {
    const { phoneNumber, message } = args;
    const accountSid = args.iparams.twilio_account_sid;
    const authToken = args.iparams.twilio_auth_token;
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    try {
      const body = new URLSearchParams({
        To: phoneNumber,
        From: args.iparams.twilio_phone_number,
        Body: message
      }).toString();

      const response = await $request.invokeTemplate('sendTwilioSMS', {
        context: { basic_auth: credentials },
        body: body
      });

      const data = JSON.parse(response.response);
      console.info('[sendSMSNotification] SMS sent:', data.sid);

      renderData(null, { success: true, messageSid: data.sid });
    } catch (error) {
      console.error('[sendSMSNotification] Error:', error.message);
      renderData({ status: 500, message: 'Failed to send SMS' });
    }
  }
};
```

### 6. Salesforce API - Create/Update Records

```json
// config/requests.json
{
  "createSalesforceRecord": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "<%= iparam.salesforce_instance %>.salesforce.com",
      "path": "/services/data/v57.0/sobjects/<%= context.object_type %>",
      "headers": {
        "Authorization": "Bearer <%= iparam.salesforce_access_token %>",
        "Content-Type": "application/json"
      }
    }
  },
  "querySalesforce": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "<%= iparam.salesforce_instance %>.salesforce.com",
      "path": "/services/data/v57.0/query",
      "query": {
        "q": "<%= context.soql_query %>"
      },
      "headers": {
        "Authorization": "Bearer <%= iparam.salesforce_access_token %>"
      }
    }
  }
}
```

```javascript
// server/server.js
exports = {
  syncContactToSalesforce: async function(args) {
    const { contact } = args.data;

    try {
      // Check if contact exists
      const query = `SELECT Id FROM Contact WHERE Email = '${contact.email}' LIMIT 1`;
      const searchResponse = await $request.invokeTemplate('querySalesforce', {
        context: { soql_query: query }
      });

      const searchData = JSON.parse(searchResponse.response);

      if (searchData.totalSize > 0) {
        console.info('[syncContactToSalesforce] Contact exists:', searchData.records[0].Id);
        renderData(null, { success: true, contactId: searchData.records[0].Id, action: 'found' });
        return;
      }

      // Create new contact
      const contactData = {
        FirstName: contact.first_name,
        LastName: contact.last_name,
        Email: contact.email,
        Phone: contact.phone
      };

      const createResponse = await $request.invokeTemplate('createSalesforceRecord', {
        context: { object_type: 'Contact' },
        body: JSON.stringify(contactData)
      });

      const createData = JSON.parse(createResponse.response);
      console.info('[syncContactToSalesforce] Contact created:', createData.id);

      renderData(null, { success: true, contactId: createData.id, action: 'created' });
    } catch (error) {
      console.error('[syncContactToSalesforce] Error:', error.message);
      renderData({ status: 500, message: 'Failed to sync to Salesforce' });
    }
  }
};
```

---

## Common Mistakes & Fixes

### 1. FQDN with Path

```json
// WRONG - Path included in host
{
  "badRequest": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com/v2/users",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>"
      }
    }
  }
}

// CORRECT - Host and path separated
{
  "goodRequest": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v2/users",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>"
      }
    }
  }
}
```

**Error:** `FQDN must not include path`
**Fix:** Separate `host` (domain only) and `path` (route)

### 2. Missing Content-Type Header

```json
// WRONG - No Content-Type for POST
{
  "badPost": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "api.example.com",
      "path": "/v1/users",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>"
      }
    }
  }
}

// CORRECT - Content-Type specified
{
  "goodPost": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "api.example.com",
      "path": "/v1/users",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

**Error:** API returns 415 Unsupported Media Type
**Fix:** Always include `Content-Type` header for POST/PUT/PATCH

### 3. Incorrect Method Type

```json
// WRONG - Using GET for data modification
{
  "badMethod": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v1/users/<%= context.id %>/delete"
    }
  }
}

// CORRECT - Using DELETE method
{
  "goodMethod": {
    "schema": {
      "protocol": "https",
      "method": "DELETE",
      "host": "api.example.com",
      "path": "/v1/users/<%= context.id %>",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>"
      }
    }
  }
}
```

**Error:** API returns 405 Method Not Allowed
**Fix:** Use correct HTTP method (GET, POST, PUT, PATCH, DELETE)

### 4. Missing Error Handling

```javascript
// WRONG - No error handling
exports = {
  badFetch: async function(args) {
    const response = await $request.invokeTemplate('getData', {});
    renderData(null, JSON.parse(response.response));
  }
};

// CORRECT - Proper error handling
exports = {
  goodFetch: async function(args) {
    try {
      const response = await $request.invokeTemplate('getData', {
        context: { id: args.id }
      });

      const data = JSON.parse(response.response);
      renderData(null, { success: true, data: data });
    } catch (error) {
      console.error('[goodFetch] Error:', error.message);
      renderData({
        status: error.status || 500,
        message: error.message || 'Request failed'
      });
    }
  }
};
```

**Error:** App crashes on API failure
**Fix:** Always use try/catch and handle errors properly

### 5. Query Parameter Encoding

```json
// WRONG - Special characters not encoded
{
  "badQuery": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v1/search",
      "query": {
        "q": "<%= context.search_term %>"
      }
    }
  }
}
```

```javascript
// CORRECT - Encode special characters
exports = {
  searchWithEncoding: async function(args) {
    const encodedTerm = encodeURIComponent(args.searchTerm);

    try {
      const response = await $request.invokeTemplate('searchApi', {
        context: { search_term: encodedTerm }
      });

      renderData(null, { success: true, data: JSON.parse(response.response) });
    } catch (error) {
      console.error('[searchWithEncoding] Error:', error.message);
      renderData({ status: 500, message: error.message });
    }
  }
};
```

**Error:** API returns 400 Bad Request for special characters
**Fix:** Use `encodeURIComponent()` for query parameters

### 6. Dynamic Path Parameters Not in Context

```json
// WRONG - Hardcoded ID in path
{
  "badPath": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v1/users/123",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>"
      }
    }
  }
}

// CORRECT - Dynamic path parameter
{
  "goodPath": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "api.example.com",
      "path": "/v1/users/<%= context.user_id %>",
      "headers": {
        "Authorization": "Bearer <%= iparam.api_key %>"
      }
    }
  }
}
```

```javascript
// Usage
const response = await $request.invokeTemplate('goodPath', {
  context: { user_id: args.userId }
});
```

**Error:** Always fetches same user
**Fix:** Use `<%= context.variable %>` for dynamic values

### 7. Not Declaring Template in Manifest

```json
// config/requests.json exists but manifest missing declaration

// WRONG - manifest.json
{
  "platform-version": "3.0",
  "modules": {
    "common": {},
    "support_ticket": {}
  }
}

// CORRECT - manifest.json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "requests": {
        "getData": {},
        "postData": {}
      }
    },
    "support_ticket": {}
  }
}
```

**Error:** `Request template 'getData' not found in manifest`
**Fix:** Declare ALL request templates in `manifest.json` under `modules.common.requests`

---

## Quick Reference

| Pattern | Use Case | Key Files |
|---------|----------|-----------|
| Pagination | Large datasets | requests.json + server.js |
| Rate Limiting | API limits | requests.json (options) + retry logic |
| Batch Requests | Bulk operations | Chunk array + loop requests |
| Webhooks | Real-time events | Signature verification |
| File Upload | Document sync | multipart/form-data |
| Error Handling | Robust apps | try/catch + status codes |
| Auth Patterns | Secure access | iparams.json + headers |
| Real-World APIs | External integrations | Specific API docs |

**Related:** `request-templates-latest.md`, `request-method-docs.md`, `oauth-configuration-latest.md`
