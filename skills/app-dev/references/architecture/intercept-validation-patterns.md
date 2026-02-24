# Intercept Events and Validation Patterns

## When to Use Intercept Events vs Frontend

**Use intercept events (background app) when:**
- User says: "prevent", "block", "stop", "don't allow", "enforce", "validate before"
- Requirement is to enforce a rule at platform level
- Action must be blocked if validation fails

**Use frontend UI when:**
- User asks to "show", "display", "view", "dashboard"
- Manual interaction needed (buttons, forms)
- Displaying information or status

**Decision rule:** Enforcement/blocking = intercept event. Display/interaction = frontend UI.

---

## Background Location Implementation

**Background locations run invisibly for event interception:**

**Freshdesk/Freshservice:**
- `ticket_background` - Ticket details page background
- `new_ticket_background` - New ticket page background

**Freshsales:**
- `deal_background` - Deal details page background
- `contact_background` - Contact details page background

**Manifest structure:**
```json
{
  "modules": {
    "PRODUCT_MODULE": {
      "location": {
        "BACKGROUND_LOCATION": {
          "url": "background.html"
        }
      }
    }
  }
}
```

**Background HTML (placeholder):**
```html
<!DOCTYPE html>
<html>
<head>
  <script src="{{{appclient}}}"></script>
</head>
<body>
  <script src="scripts/background.js"></script>
</body>
</html>
```

---

## Intercept Event Pattern

**Subscribe with `{ intercept: true }`:**

```javascript
client.events.on('EVENT_NAME', async function(event) {
  // Validation logic
  const isValid = await validateCondition();
  
  if (!isValid) {
    // Show error and block action
    await client.interface.trigger('showNotify', {
      type: 'danger',
      message: 'Validation failed'
    });
    return; // Blocks the action
  }
  
  // Action proceeds if we don't return
}, { intercept: true }); // ← CRITICAL
```

**Common intercept events:**
- `ticket.propertiesUpdated` - Field changes
- `conversation.beforeCreate` - Before reply/note
- `ticket.beforeClose` - Before ticket closed

---

## Validation Patterns

### Required Field Validation
```javascript
function validateRequiredFields(entity, requiredFields) {
  const missing = requiredFields.filter(field => {
    const value = entity[field];
    return value === null || value === undefined || value === '' ||
           (Array.isArray(value) && value.length === 0);
  });
  
  return {
    valid: missing.length === 0,
    message: missing.length > 0 ? `Required: ${missing.join(', ')}` : ''
  };
}
```

### Conditional Validation
```javascript
function validateCondition(entity, rules) {
  // Block action based on field values
  if (entity.fieldA === valueX && !entity.fieldB) {
    return {
      valid: false,
      message: 'Field B required when Field A is set'
    };
  }
  return { valid: true };
}
```

---

## File Structure

**Background app (no frontend):**
```
app-name/
├── app/
│   ├── background.html (placeholder)
│   └── scripts/
│       └── background.js (intercept logic)
├── config/
│   └── iparams.json (validation rules)
├── manifest.json (background location)
└── README.md
```

**No `styles/`, no `icon.svg` needed for background-only apps.**
