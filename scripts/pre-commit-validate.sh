#!/bin/bash
# Pre-commit validation script - runs all checks before commit
# Usage: ./scripts/pre-commit-validate.sh

set -e

echo "🔍 Running comprehensive pre-commit validation..."
echo ""

FAILED=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Trailing whitespace
echo "1️⃣  Checking for trailing whitespace..."
files_to_check=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(md|json|yml|js|mdc)$' || true)
if [ -n "$files_to_check" ]; then
    whitespace_files=$(echo "$files_to_check" | xargs grep -l '[[:space:]]$' 2>/dev/null || true)
    if [ -n "$whitespace_files" ]; then
        echo -e "${RED}❌ Files with trailing whitespace found:${NC}"
        echo "$whitespace_files"
        echo "Run: sed -i '' 's/[[:space:]]*$//' <file>"
        FAILED=1
    else
        echo -e "${GREEN}✅ No trailing whitespace${NC}"
    fi
else
    echo -e "${GREEN}✅ No trailing whitespace (no matching files staged)${NC}"
fi
echo ""

# Check 2: File size
echo "2️⃣  Checking file sizes..."
large_files=$(git diff --cached --name-only --diff-filter=ACM | xargs -I {} find {} -type f -size +1M 2>/dev/null || true)
if [ -n "$large_files" ]; then
    echo -e "${RED}❌ Large files detected (>1MB):${NC}"
    echo "$large_files"
    FAILED=1
else
    echo -e "${GREEN}✅ No large files${NC}"
fi
echo ""

# Check 3: JSON validation
echo "3️⃣  Validating JSON files..."
json_invalid=0
git diff --cached --name-only --diff-filter=ACM | grep '\.json$' | while read file; do
    if [ -f "$file" ]; then
        if ! node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))" 2>/dev/null; then
            echo -e "${RED}❌ Invalid JSON: $file${NC}"
            json_invalid=$((json_invalid + 1))
        fi
    fi
done
if [ $json_invalid -eq 0 ]; then
    echo -e "${GREEN}✅ All JSON files valid${NC}"
else
    FAILED=1
fi
echo ""

# Check 4: Plugin structure consistency
echo "4️⃣  Validating plugin structure..."
cursor_desc=$(jq -r '.metadata.description' .cursor-plugin/marketplace.json 2>/dev/null)
claude_desc=$(jq -r '.metadata.description' .claude-plugin/marketplace.json 2>/dev/null)

if [ "$cursor_desc" != "$claude_desc" ]; then
    echo -e "${YELLOW}⚠️  Plugin descriptions differ:${NC}"
    echo "  Cursor: $cursor_desc"
    echo "  Claude: $claude_desc"
fi

# Check for outdated references
if echo "$cursor_desc" | grep -q "FDK setup\|publish"; then
    echo -e "${RED}❌ .cursor-plugin/marketplace.json has outdated description${NC}"
    FAILED=1
fi
if echo "$claude_desc" | grep -q "FDK setup\|publish"; then
    echo -e "${RED}❌ .claude-plugin/marketplace.json has outdated description${NC}"
    FAILED=1
fi

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Plugin structure consistent${NC}"
fi
echo ""

# Check 5: Required files exist
echo "5️⃣  Checking required files..."
required_files=(
    ".cursor-plugin/plugin.json"
    ".claude-plugin/plugin.json"
    "manifest.json"
    "skills/app-dev/SKILL.md"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing required file: $file${NC}"
        FAILED=1
    fi
done

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All required files present${NC}"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✨ All checks passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Validation failed - fix issues before committing${NC}"
    exit 1
fi
