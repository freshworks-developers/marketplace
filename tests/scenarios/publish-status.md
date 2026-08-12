# Scenario: publish-status (TF6)

**Intent:** `publish-status` · **Precondition:** App submitted to marketplace

## Steps

1. User: "Why was my app rejected?"
2. Agent classifies `publish-status`
3. MCP: `list_custom_apps` → `list_app_versions` → `get_app_status`
4. Merge session `publish.tracking_id` if set
5. Human-readable status/rejection reason

## Degradation

If MCP unavailable: "Marketplace status unavailable — check Developer Portal or retry."

## Pass criteria

- No fw-publish unless user separately confirms submit
- No fabricated rejection reasons
