# app-dev Skill Optimization Plan

**Date**: 2026-03-30
**Goal**: Reduce token consumption based on 2026 best practices

## Current State Analysis

**Total Lines**: 3,500 across SKILL.md + rules
**Target**: <500 lines for SKILL.md, <200 lines per rule

### Largest Files (Lines)
1. `validation-workflow.mdc` - 719 lines ⚠️ **TOO LARGE**
2. `SKILL.md` - 571 lines ⚠️ **EXCEEDS TARGET**
3. `platform3-modules-locations.mdc` - 403 lines ⚠️ **TOO LARGE**
4. `async-patterns.mdc` - 259 lines ⚠️ **EXCEEDS TARGET**
5. `app-templates.mdc` - 223 lines ✓ **ACCEPTABLE**
6. `security.mdc` - 218 lines ✓ **ACCEPTABLE**

## Research-Based Optimization Principles

### 1. Progressive Disclosure (SKILL.md Standard)
- **Discovery**: ~100 tokens (name + description)
- **Activation**: <5,000 tokens (full SKILL.md)
- **Keep SKILL.md under 500 lines**
- Move detailed examples to `references/`

### 2. Token Efficiency (Cursor 2026)
- **47% reduction** possible with dynamic context
- **Avoid always-apply rules** consuming tokens on every prompt
- **150-300 words optimal** for instructions
- **Lost in the middle problem**: Keep critical info at start/end

### 3. Single Workflow Per Skill
- Multi-mode skills degrade performance
- Each rule should focus on ONE job
- Avoid conditional branching

### 4. Context Optimization
- **Start simple, expand only when needed**
- **Compress**: Use tables instead of verbose lists
- **Isolate**: Separate concerns into focused files
- **Reference, don't duplicate**: Point to external docs

## Optimization Strategy

### Phase 1: Reduce `validation-workflow.mdc` (719 → 300 lines)

**Remove:**
- ✂️ Long examples (move to `references/validation-examples.md`)
- ✂️ Duplicate fix patterns already in other rules
- ✂️ Verbose iteration logging examples (keep 1 concise example)

**Keep:**
- ✅ Critical workflow steps
- ✅ Error reporting format
- ✅ Critical rules list

**Estimated Reduction**: 419 lines → `references/validation-examples.md`

### Phase 2: Reduce `SKILL.md` (571 → 400 lines)

**Remove:**
- ✂️ Verbose checklists (convert to compact tables)
- ✂️ Duplicate content already in rules
- ✂️ Extended examples (already in references)

**Keep:**
- ✅ Core workflow
- ✅ Critical validations table
- ✅ Pointers to rules and references

**Estimated Reduction**: 171 lines

### Phase 3: Reduce `platform3-modules-locations.mdc` (403 → 200 lines)

**Remove:**
- ✂️ Exhaustive product-module tables (move to `references/modules-reference.md`)
- ✂️ Verbose location descriptions

**Keep:**
- ✅ Decision tree for module selection
- ✅ Most common modules (top 10 per product)
- ✅ Validation rules

**Estimated Reduction**: 203 lines → `references/modules-reference.md`

### Phase 4: Reduce `async-patterns.mdc` (259 → 200 lines)

**Remove:**
- ✂️ Redundant examples
- ✂️ Long explanations

**Keep:**
- ✅ Core patterns (1 example each)
- ✅ Critical rules
- ✅ Quick reference table

**Estimated Reduction**: 59 lines

### Phase 5: Convert `alwaysApply: true` Rules to Conditional

**Current always-apply rules** (consume tokens on EVERY prompt):
- `validation-workflow.mdc`
- `freshworks-platform3.mdc`
- `app-building-blocking-gates.mdc`
- `security.mdc`

**Strategy**:
- Keep `freshworks-platform3.mdc` as always-apply (core enforcement)
- Convert others to `alwaysApply: false` with clear activation triggers
- Use glob patterns to scope rules to relevant files

**Estimated Token Savings**: 30-40% on non-app-generation prompts

## Expected Results

### Before Optimization
- **Total**: 3,500 lines
- **SKILL.md**: 571 lines
- **Always-apply overhead**: ~4 rules × every prompt

### After Optimization
- **Total**: ~2,200 lines (-37%)
- **SKILL.md**: ~400 lines (-30%)
- **Always-apply overhead**: 1 rule (core enforcement only)
- **Token savings**: 40-50% on average prompts

## Implementation Priority

1. **HIGH**: Phase 5 (convert always-apply rules) - immediate 30-40% savings
2. **HIGH**: Phase 1 (validation-workflow) - largest file
3. **MEDIUM**: Phase 2 (SKILL.md) - entry point optimization
4. **MEDIUM**: Phase 3 (platform3-modules-locations) - reference data
5. **LOW**: Phase 4 (async-patterns) - already reasonable size

## Validation

After each phase:
1. Test skill activation with sample prompts
2. Verify all critical information still accessible
3. Measure token consumption (if possible)
4. Ensure no functionality loss

## Notes

- Follow SKILL.md standard: <500 lines for main file
- Use progressive disclosure: load details on-demand
- Keep critical enforcement rules always-apply
- Move examples and reference data to `references/`
- Compress verbose lists into tables
- Remove redundancy across files
