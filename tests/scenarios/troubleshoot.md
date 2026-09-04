# Scenario: troubleshoot (TF3)

**Intent:** `troubleshoot` · **Precondition:** Build/validation error present

## Steps

1. User: "fdk validate fails with iparam error"
2. Agent classifies `troubleshoot`; does not re-run fw-setup if toolchain OK
3. Route to `/fdk-fix` or targeted fix
4. Increment `escalation.fix_attempt_count`; track `last_error_signature`
5. After 3 same-signature failures → escalation handoff (§escalation)

## Pass criteria

- deploy_attempt_count ≤ 6
- Escalation at 3 identical signatures
