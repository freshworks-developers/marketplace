>title: Fixing mandatory keys missing error
>tags: iparams, installation-parameters, installation-page
>context: iparams.json
>content:

# Fixing mandatory keys missing error

## FDK validation fails with the error
```
The mandatory key(s), <mandatory_keys> , missing for the '<key>' field.
```

## Steps to fix the error
1. In `config/iparams.json`, ensure all the iparams keys have `display_name` and valid `type`.
2. If the `type` of iparam is `radio`, `multiselect` or `dorpdown` ensure `options` keys are defined.
3. If iparams have `domain` and `api_key` type defined, ensure `type_attributes` are also defined for those iparam keys.

---

>title: Fixing invalid type error
>tags: iparams, installation-parameters, installation-page
>context: iparams.json
>content:

# Fixing invalid type error

## FDK validation fails with the error
```
Invalid type, <type of key>, found in the '<key>' field.
```

## Steps to fix the error
In `config/iparams.json`, the possible values supported in `type` are - `text`, `paragraph`, `dropdown`, `email`, `number`, `phone_number`, `date`, `url`, `radio`, `checkbox`, `multiselect`, `domain`, `api_key`.

---


>title: Fixing missing `type_attributes` error
>tags: iparams, installation-parameters, installation-page
>context: iparams.json
>content:

# Fixing missing `type_attributes` error

## FDK validation fails with the error
```
`type_attributes` must be specified for type <type> in `config/iparams.json`.
```

## Steps to fix the error
If iparams have `domain` and `api_key` type defined, ensure `type_attributes` are also defined for those iparam keys in `config/iparams.json`.

---

>title: Fixing missing `type_attributes` error
>tags: iparams, installation-parameters, installation-page
>context: iparams.json
>content:

# Fixing missing `type_attributes` error

## FDK validation fails with the error
```
Mandatory key(s) `product` missing in `type_attributes` for <key> in `config/iparams.json`.
```

## Steps to fix the error
In `config/iparams.json`, have `domain` and `api_key` type defined, ensure `type_attributes` also has a valid `product` associated with it. Valid options are - `freshdesk`, `freshservice`, `freshsales`, `freshworks_crm`.
```json
{
  "domainName": {
    "display_name": "domain_name",
    "description": "Please enter your domain name",
    "type": "domain",
    "type_attributes": {
      "product": "freshdesk"
    },
    "required": true
  }
}
```

---

>title: Fixing missing `type_attributes` error
>tags: iparams, installation-parameters, installation-page
>context: iparams.json
>content:

# Fixing missing `type_attributes` error

## FDK validation fails with the error
```
Invalid product name format '<product name>'. Use lowercase without space
```

## Steps to fix the error
In `config/iparams.json`, have `domain` and `api_key` type defined, ensure `type_attributes` also has a valid `product` associated with it. Valid options are - `freshdesk`, `freshservice`, `freshsales`, `freshworks_crm`.
```json
{
  "domainName": {
    "display_name": "domain_name",
    "description": "Please enter your domain name",
    "type": "domain",
    "type_attributes": {
      "product": "freshdesk"
    },
    "required": true
  }
}
```

---

>title: Fixing `type_attributes.product` name error
>tags: iparams, installation-parameters, installation-page
>context: iparams.json, manifest.json
>content:

# Fixing `type_attributes.product` name error

## FDK validation fails with the error
```
In iparams.json, type_attributes.product is "<product name>". It must be the same as the product name mentioned in manifest.json. Please modify it.
```

## Steps to fix the error
In `config/iparams.json`, ensure the product mentioned in `type_attributes.product` is same as the product mentioned in `manifest.json`.

---


>title: Fixing dropdown default value errors
>tags: iparams, installation-parameters, dropdown, default-value
>context: iparams.json
>content:

# Fixing dropdown default value errors

## FDK validation fails with the error

**Error 1:**
```
The default value specified for the '<field_name>' dropdown type is not listed in the options.
```

**Error 2:**
```
In the '<field_name>' field, specify the default value for the dropdown type.
```

## Steps to fix the errors

### Issue 1: Default value doesn't match options

The `default_value` field must EXACTLY match one of the option's `value` fields (case-sensitive, no extra spaces).

**⚠️ Critical for AI Agents:**
When generating dropdown iparams:
1. **Never assume** - Always verify default_value is in options list
2. **Match exact strings** - Case, spacing, special characters must be identical
3. **Use value, not label** - default_value matches option's `value` field, NOT `label`
4. **String-compare** - Treat as string comparison: "prod" ≠ "production" ≠ "Prod"

**Common Causes:**
1. Typo in default_value or option value
2. Case sensitivity mismatch ("Active" vs "active")
3. Extra whitespace in values
4. Using label text as default instead of value
5. Shortened form vs full form ("dev" vs "development")

**Pitfall 1: Case Mismatch**
```json
// ❌ WRONG
{
  "environment": {
    "type": "dropdown",
    "default_value": "Production",  // Capital P
    "options": [
      { "label": "Production", "value": "production" }  // lowercase
    ]
  }
}

// ✅ CORRECT
{
  "environment": {
    "type": "dropdown",
    "default_value": "production",  // Matches exactly
    "options": [
      { "label": "Production", "value": "production" }
    ]
  }
}
```

**Pitfall 2: Using Label Instead of Value**
```json
// ❌ WRONG - Using label text
{
  "log_level": {
    "type": "dropdown",
    "default_value": "Informational Logs",  // This is the label!
    "options": [
      { "label": "Informational Logs", "value": "info" },
      { "label": "Debug Logs", "value": "debug" }
    ]
  }
}

// ✅ CORRECT - Using value
{
  "log_level": {
    "type": "dropdown",
    "default_value": "info",  // Use value field
    "options": [
      { "label": "Informational Logs", "value": "info" },
      { "label": "Debug Logs", "value": "debug" }
    ]
  }
}
```

**Pitfall 3: Value Not in Options List**
```json
// ❌ WRONG - "all" doesn't exist in options
{
  "filter": {
    "type": "dropdown",
    "default_value": "all",
    "options": [
      { "label": "Active Only", "value": "active" },
      { "label": "Inactive Only", "value": "inactive" }
    ]
  }
}

// ✅ CORRECT - Default exists in options
{
  "filter": {
    "type": "dropdown",
    "default_value": "active",
    "options": [
      { "label": "Active Only", "value": "active" },
      { "label": "Inactive Only", "value": "inactive" }
    ]
  }
}
```

### Issue 2: Missing default_value field

All dropdown iparams MUST have a `default_value` field.

**⚠️ Critical for AI Agents:**
- **Never generate dropdown without default_value** - It is mandatory
- **Do NOT assume** platform picks first option as default
- **Do NOT assume** user will set it later
- **ALWAYS include** default_value field explicitly

**Example - WRONG:**
```json
// ❌ Missing default_value (mandatory field)
{
  "report_type": {
    "type": "dropdown",
    "display_name": "Report Type",
    "options": [
      { "label": "Summary", "value": "summary" },
      { "label": "Detailed", "value": "detailed" }
    ]
  }
}
```

**Example - CORRECT:**
```json
// ✅ Has default_value (required)
{
  "report_type": {
    "type": "dropdown",
    "display_name": "Report Type",
    "default_value": "summary",  // Mandatory!
    "options": [
      { "label": "Summary", "value": "summary" },
      { "label": "Detailed", "value": "detailed" }
    ]
  }
}
```

## Important Notes for AI Agents

**Platform Behavior:**
1. **Cannot use `"default": true` inside option objects** - Platform doesn't support this
2. **`default_value` is a top-level field** - Same level as `type`, `display_name`, `options`
3. **String matching is exact** - No fuzzy matching, no normalization, character-perfect match required
4. **First option is NOT automatically default** - Must explicitly set `default_value`
5. **No type coercion** - "1" (string) ≠ 1 (number)

**Generation Guidelines:**
- When creating dropdown iparams, ALWAYS add `default_value` field before generating
- When setting default_value, ALWAYS verify it exists in options array
- When copying option values, maintain exact case and format
- Prefer simple, lowercase values to avoid case issues (e.g., "active" not "Active")
- Double-check match before finalizing iparam definition

## Troubleshooting Checklist

When validation fails with dropdown default errors:

- [ ] 1. Verify `default_value` field exists at top level (not inside options)
- [ ] 2. Check spelling: `default_value` and all option `value` fields character-by-character
- [ ] 3. Verify case: "open" ≠ "Open" ≠ "OPEN"
- [ ] 4. Check for whitespace: "active" ≠ "active " ≠ " active"
- [ ] 5. Confirm using `value` field, not `label` field
- [ ] 6. Verify the value exists in at least one option's `value` field
- [ ] 7. Check for typos: "prod" ≠ "production" ≠ "produ"

---

