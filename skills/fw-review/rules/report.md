# App review report — emit format and rule index

Human-readable **summary** the pipeline prints after evaluating the rule IDs listed in the **Rule ID summary** in [SKILL.md](../SKILL.md). **Omit** lines for Pass and Not Applicable.


---

## User-visible output

### No failures

Print exactly:

```text
App Review Result
successful
```

Use the word **successful** alone on the line after the heading (lowercase).

### One or more failures

Print the heading, then one aligned block per failed rule using this shape:

```text
App Review Result

1. Issue: <clear failure reason>
   Location: <file path and line/block, when available>
   Fix: <actionable fix message>

2. Issue: <clear failure reason>
   Location: <file path and line/block, when available>
   Fix: <actionable fix message>
```

Requirements:

- **Only** rules with result **Fail** appear; do not list passing or N/A rules.
- Use **one numbered block per failed rule**.
- Do **not** include internal rule IDs or internal JSON metadata such as `internal.rule_id` in the user-visible output.
- Do **not** include rule IDs in headings, issue text, location text, or fix text.
- **Issue**: concise, user-readable failure reason.
- **Location**: cite file and line when available. If a line is unavailable, cite the closest identifiable block, field, function, or file.
- **Fix**: actionable remediation; use the relevant **Fix messages** / **Goal** / **Pass** sections in [iparam-rules.md](iparam-rules.md), [frontend-files-rules.md](frontend-files-rules.md), and [script-check-rules.md](script-check-rules.md).
- Keep each block compact. Do not combine multiple unrelated failures into one long sentence.
- If a script emits multiple details for the same rule, group them under one block only when the fix is the same. Use comma-separated locations or a short `Location:` list.

### Example — failures

```text
App Review Result

1. Issue: Host field accepts a full URL with protocol.
   Location: config/iparams.json field "domain"
   Fix: Reject or strip http(s):// and update the hint to show hostname-only input, such as api.example.com.

2. Issue: FDK validation reports request template errors.
   Location: manifest.json and config/requests.json
   Fix: Align manifest request declarations with config/requests.json and fix invalid template references.
```

### Example — success

```text
App Review Result
successful
```

---


