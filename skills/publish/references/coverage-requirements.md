# Test Coverage Requirements for Marketplace Submission

Complete guide to meeting the 80% code coverage requirement for Freshworks marketplace apps.

## Coverage Requirements

**Minimum thresholds (all must be >= 80%):**
- **Statements:** 80%
- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%

**All four metrics must meet the threshold.** If any single metric is below 80%, the app will be rejected.

## Generating Coverage

### Step 1: Run App Locally

```bash
cd <app-directory>
fdk run
```

**What happens:**
1. FDK starts local development server
2. App is deployed and testable
3. Test suite runs automatically (if tests exist)
4. Coverage data is collected

### Step 2: Stop Server

```bash
# Press Ctrl+C to stop the server
```

**After stopping:**
- Coverage summary is displayed in terminal
- Coverage report saved to `coverage/` folder
- `coverage-summary.json` contains detailed metrics

### Step 3: Review Coverage

**Terminal output:**
```
========= Coverage summary ==========
    Statements   : 87.5% ( 70/80 )
    Branches     : 90.0% ( 18/20 )
    Functions    : 85.0% ( 17/20 )
    Lines        : 88.2% ( 75/85 )
======================================
```

**Coverage files:**
- `coverage/coverage-summary.json` - JSON format
- `coverage/lcov-report/index.html` - HTML report (open in browser)
- `coverage/lcov.info` - LCOV format

## Coverage Report Structure

**coverage-summary.json:**
```json
{
  "total": {
    "lines": {
      "total": 85,
      "covered": 75,
      "skipped": 0,
      "pct": 88.2
    },
    "statements": {
      "total": 80,
      "covered": 70,
      "skipped": 0,
      "pct": 87.5
    },
    "functions": {
      "total": 20,
      "covered": 17,
      "skipped": 0,
      "pct": 85
    },
    "branches": {
      "total": 20,
      "covered": 18,
      "skipped": 0,
      "pct": 90
    }
  }
}
```

## Writing Tests

**Test location:** `server/test/`

**Test framework:** Jest (built into FDK)

**Example test structure:**
```javascript
// server/test/server.test.js

describe('onTicketCreate handler', () => {
  it('should process ticket successfully', async () => {
    const mockArgs = {
      data: {
        ticket: { id: 123, subject: 'Test' }
      },
      iparams: {}
    };
    
    const result = await onTicketCreateHandler(mockArgs);
    expect(result).toBeDefined();
  });

  it('should handle errors gracefully', async () => {
    const mockArgs = { data: null };
    await expect(onTicketCreateHandler(mockArgs)).rejects.toThrow();
  });
});
```

## Improving Coverage

### 1. Test All Event Handlers

**For each handler in server.js:**
- Test success case
- Test error cases
- Test edge cases
- Test validation logic

**Example:**
```javascript
// Handler
exports.onTicketCreateHandler = async function(args) {
  const ticket = args.data.ticket;
  if (!ticket) {
    throw new Error('Ticket data missing');
  }
  // Process ticket
  return { success: true };
};

// Tests
describe('onTicketCreateHandler', () => {
  it('processes valid ticket', async () => { /* ... */ });
  it('throws error for missing ticket', async () => { /* ... */ });
  it('handles API failures', async () => { /* ... */ });
});
```

### 2. Test All Branches

**Cover all conditional paths:**
```javascript
// Code with branches
function processStatus(status) {
  if (status === 'open') {
    return 'active';
  } else if (status === 'closed') {
    return 'resolved';
  } else {
    return 'unknown';
  }
}

// Tests for all branches
it('returns active for open', () => { /* ... */ });
it('returns resolved for closed', () => { /* ... */ });
it('returns unknown for other', () => { /* ... */ });
```

### 3. Test Error Handling

**Test try-catch blocks:**
```javascript
// Code with error handling
async function callAPI() {
  try {
    const result = await $request.invokeTemplate('apiCall', {});
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Tests
it('returns result on success', async () => { /* ... */ });
it('throws error on failure', async () => { /* ... */ });
it('logs error message', async () => { /* ... */ });
```

### 4. Test Helper Functions

**Don't forget helper functions:**
```javascript
// Helper function
function formatDate(date) {
  return new Date(date).toISOString();
}

// Test
it('formats date correctly', () => {
  expect(formatDate('2024-01-01')).toBe('2024-01-01T00:00:00.000Z');
});
```

## Coverage Analysis

### View HTML Report

```bash
# Open coverage report in browser
open coverage/lcov-report/index.html
```

**Report shows:**
- Overall coverage percentages
- File-by-file breakdown
- Line-by-line coverage (green = covered, red = not covered)
- Branch coverage visualization
- Function coverage list

### Identify Uncovered Code

**In HTML report:**
1. Look for red-highlighted lines (not covered)
2. Check "Uncovered Lines" column
3. Review "Branches" column for partial coverage
4. Focus on functions with 0% coverage

**Common uncovered areas:**
- Error handling paths (catch blocks)
- Edge cases (null checks, validation)
- Rarely-used features
- Fallback logic

## Testing Best Practices

### 1. Test-Driven Development
- Write tests before code
- Red → Green → Refactor
- Ensures testable code

### 2. Mock External Dependencies
```javascript
// Mock $request
jest.mock('$request', () => ({
  invokeTemplate: jest.fn()
}));

// Test with mock
it('calls API correctly', async () => {
  $request.invokeTemplate.mockResolvedValue({ data: 'test' });
  const result = await handler(args);
  expect($request.invokeTemplate).toHaveBeenCalledWith('apiCall', {});
});
```

### 3. Test Edge Cases
- Null/undefined inputs
- Empty arrays/objects
- Invalid data types
- API failures
- Network timeouts

### 4. Test Async Operations
```javascript
it('handles async operations', async () => {
  const promise = asyncFunction();
  await expect(promise).resolves.toBe('result');
});

it('handles async errors', async () => {
  const promise = failingAsyncFunction();
  await expect(promise).rejects.toThrow('error');
});
```

## Running Tests Manually

**Run all tests:**
```bash
fdk test
```

**Run specific test file:**
```bash
fdk test -- server/test/specific.test.js
```

**Run with coverage:**
```bash
fdk test --coverage
```

**Watch mode (re-run on changes):**
```bash
fdk test --watch
```

## Coverage Exemptions

**Some code may be exempt from coverage:**

1. **Error logging** - Console.log statements
2. **Unreachable code** - Defensive programming
3. **Type guards** - TypeScript-style checks

**However:** Marketplace requires 80% overall. Exemptions are rare.

## Common Coverage Issues

### Issue 1: Low Branch Coverage

**Problem:** Not testing all if/else paths

**Solution:**
```javascript
// Test all branches
if (condition) { /* branch 1 */ } else { /* branch 2 */ }

// Need 2 tests
it('tests branch 1', () => { /* condition = true */ });
it('tests branch 2', () => { /* condition = false */ });
```

### Issue 2: Low Function Coverage

**Problem:** Helper functions not tested

**Solution:**
- Test all exported functions
- Test all helper functions
- Test all event handlers

### Issue 3: Low Statement Coverage

**Problem:** Dead code or unreachable statements

**Solution:**
- Remove unreachable code
- Test all code paths
- Refactor complex functions

### Issue 4: Low Line Coverage

**Problem:** Similar to statement coverage

**Solution:**
- Ensure every line is executed in tests
- Remove unused code
- Test all scenarios

## Skipping Coverage (NOT Recommended)

**For testing only:**
```bash
fdk pack --skip-coverage
```

**Consequences:**
- ❌ Marketplace will reject app
- ❌ Poor code quality signal
- ❌ Higher bug risk
- ❌ Maintenance difficulties

**Only use for:**
- Local testing
- Development iterations
- Debugging pack issues

**Never use for:**
- Marketplace submission
- Production deployments
- Customer delivery

## Coverage Goals

**Minimum (Marketplace):** 80%
**Good:** 85-90%
**Excellent:** 90-95%
**Outstanding:** 95%+

**Diminishing returns:** 100% coverage is often impractical and not required.

## Resources

- **FDK Test Command:** https://freshworks.dev/docs/app-sdk/v3.0/cpq_document/basic-dev-tools/freshworks-cli/#test
- **Jest Documentation:** https://jestjs.io/docs/getting-started
- **Testing Best Practices:** https://developers.freshworks.com/docs/guides/submission-guidelines/app-validation/
