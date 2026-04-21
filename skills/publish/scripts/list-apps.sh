#!/usr/bin/env bash
# List Marketplace apps using the Developer Portal JWT (same as publish).
# Default: AMP GET /api/v2/apps?...&type=custom (server-side filter).
# Examples:
#   ./list-apps.sh                  # ?type=custom
#   ./list-apps.sh -- --type all    # omit type= (all types)
#   ./list-apps.sh -- --type marketplace
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec /usr/bin/env python3 "$SCRIPT_DIR/list_apps.py" "$@"
