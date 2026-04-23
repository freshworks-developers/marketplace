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

Print the heading, then **one line per failed rule** using this shape:

```text
App Review Result
-> Fail reason. Fix message
-> Fail reason. Fix message
```

Requirements:

- **Only** rules with result **Fail** appear; do not list passing or N/A rules.
- **One** `->` line per failed rule.
- **Fail reason**: concise, cite **file and line** (or identifiable block) when possible.
- **Fix message**: actionable remediation; use **Fix messages** / **Goal** / **Pass** sections in [iparam-rules.md](iparam-rules.md) and [frontend-files-rules.md](frontend-files-rules.md), and 

### Example — failures

```text
App Review Result
-> Host field accepts full URLs with scheme; config/iparams.json field "domain". Reject or strip http(s)://; document FQDN-only in hint/description.
-> fdk validate reports request template errors. Align manifest `modules.common.requests` with `config/requests.json` and fix template references.
```

### Example — success

```text
App Review Result
successful
```

---


