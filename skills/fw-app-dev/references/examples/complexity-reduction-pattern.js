// REFACTORING PATTERN: Multiple OR comparisons → Sets (complexity 12 → 3)

// [VALID] CORRECT - complexity 3 (Set.has() is single operation)
const HIGH_PRIORITIES = new Set(['2', '3', 'high', 'urgent']);
export function matchesPriority(ticket, filter) {
  const p = (ticket.priority || ticket.urgency || 0).toString();
  if (filter.includes('high') && HIGH_PRIORITIES.has(p)) return true;
  return false;
}

// Further complexity reduction: extract helpers after `exports` (see rules/complexity-reduction.mdc).
