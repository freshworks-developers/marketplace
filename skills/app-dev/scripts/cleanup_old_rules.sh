#!/bin/bash

# Cleanup Old Rules Script
# Removes Freshworks Platform 3.0 rules from a project (only these - never other rules).
# Run before reinstalling the skill to get a clean slate.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║           FRESHWORKS PLATFORM 3.0 RULES CLEANUP                   ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Determine project root (current directory or passed as argument)
PROJECT_ROOT="${1:-.}"
cd "$PROJECT_ROOT"
PROJECT_ROOT=$(pwd)

echo -e "${YELLOW}📁 Project root: ${PROJECT_ROOT}${NC}"
echo ""

# Function to remove rules from a directory
cleanup_rules() {
    local rules_dir="$1"
    local rules_label="$2"
    
    if [ -d "$rules_dir" ]; then
        echo -e "${YELLOW}🔍 Checking $rules_label...${NC}"
        
        # Count existing Freshworks rules (only these - never touch other project rules)
        local count=$(find "$rules_dir" -maxdepth 1 \( -name "freshworks*.mdc" -o -name "app-templates.mdc" -o -name "platform3-modules-locations.mdc" -o -name "validation-autofix.mdc" -o -name "validation-workflow.mdc" \) 2>/dev/null | wc -l | tr -d ' ')
        
        if [ "$count" -gt 0 ]; then
            echo -e "${RED}   Found $count Freshworks rule(s)${NC}"
            
            # Remove only Freshworks rules (never other rules)
            rm -f "$rules_dir"/freshworks*.mdc
            rm -f "$rules_dir"/app-templates.mdc
            rm -f "$rules_dir"/platform3-modules-locations.mdc
            rm -f "$rules_dir"/validation-autofix.mdc
            rm -f "$rules_dir"/validation-workflow.mdc
            
            echo -e "${GREEN}   ✓ Removed old rules${NC}"
        else
            echo -e "${GREEN}   ✓ No old rules found${NC}"
        fi
    else
        echo -e "${YELLOW}   ⊘ $rules_label directory not found (skipping)${NC}"
    fi
    echo ""
}

# Clean up .cursor/rules
cleanup_rules "$PROJECT_ROOT/.cursor/rules" ".cursor/rules"

# Clean up .cursor-free/rules
cleanup_rules "$PROJECT_ROOT/.cursor-free/rules" ".cursor-free/rules"

echo "════════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Cleanup complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Install the skill:"
echo "   npx skills add https://github.com/freshworks-developers/freshworks-platform3 --skill freshworks-app-dev-skill"
echo ""
echo "2. Restart Cursor IDE (Cmd+Q or Alt+F4, then reopen)"
echo ""
echo "3. Verify in Settings → Rules"
echo ""
echo "════════════════════════════════════════════════════════════════════"
