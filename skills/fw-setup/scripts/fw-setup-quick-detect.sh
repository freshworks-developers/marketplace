#!/usr/bin/env bash
# Quick FDK/Node/nvm detection (read-only). Used before mutating install Tasks.
set -euo pipefail

fdk version 2>&1 || echo "FDK not installed"
node --version 2>&1 || echo "Node not installed"
command -v nvm &>/dev/null && echo "nvm installed" || echo "nvm missing"
nvm current 2>&1 || echo "No nvm version active"
ls ~/.fdk 2>&1 || echo "No ~/.fdk directory"
