#!/bin/bash
# Fix trailing whitespace in all text files
# Usage: ./scripts/fix-trailing-whitespace.sh

echo "🔧 Fixing trailing whitespace..."

# Find and fix trailing whitespace in all relevant files
find . -type f \( -name "*.md" -o -name "*.json" -o -name "*.yml" -o -name "*.js" -o -name "*.mdc" \) \
    -not -path "./node_modules/*" \
    -not -path "./.git/*" \
    -not -path "./skills/app-dev/references/tests/*" \
    -exec sed -i '' 's/[[:space:]]*$//' {} \;

echo "✅ Done! Run 'git diff' to see changes"
