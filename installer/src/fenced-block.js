const FENCE_START = '<!-- fw-dev-tools start -->';
const FENCE_END = '<!-- fw-dev-tools end -->';
const BRAIN_FENCE_START = '<!-- fw-dev-tools-brain start -->';
const BRAIN_FENCE_END = '<!-- fw-dev-tools-brain end -->';

function upsertFencedBlock(existing, block, startMarker, endMarker) {
  const content = block.trim() + '\n';
  const startIdx = existing.indexOf(startMarker);
  const endIdx = existing.indexOf(endMarker);

  if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
    const after = existing.slice(endIdx + endMarker.length).replace(/^\n/, '');
    return existing.slice(0, startIdx) + content + after;
  }

  const separator = existing.length > 0 && !existing.endsWith('\n') ? '\n' : '';
  return existing + separator + content;
}

function removeFencedBlock(content, startMarker, endMarker) {
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) return content;
  const removed = content.slice(0, startIdx) + content.slice(endIdx + endMarker.length);
  return removed.replace(/\n{3,}/g, '\n\n');
}

/**
 * Idempotently insert or replace a fenced fw-dev-tools block in a string.
 * - If the fences are already present, replaces the content between them.
 * - If absent, appends the block with a preceding newline.
 *
 * @param {string} existing - Current file content
 * @param {string} block - The block to insert (must include fence markers)
 * @returns {string} Updated content
 */
export function upsertBlock(existing, block) {
  return upsertFencedBlock(existing, block, FENCE_START, FENCE_END);
}

export function upsertBrainBlock(existing, innerContent) {
  const block = `\n${BRAIN_FENCE_START}\n${innerContent.trim()}\n${BRAIN_FENCE_END}\n`;
  return upsertFencedBlock(existing, block, BRAIN_FENCE_START, BRAIN_FENCE_END);
}

/**
 * Remove the fenced fw-dev-tools block from a string.
 * Collapses any resulting triple-newlines to double.
 *
 * @param {string} content
 * @returns {string}
 */
export function removeBlock(content) {
  return removeFencedBlock(content, FENCE_START, FENCE_END);
}

export function removeBrainBlock(content) {
  return removeFencedBlock(content, BRAIN_FENCE_START, BRAIN_FENCE_END);
}
