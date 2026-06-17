const FENCE_START = '<!-- fw-dev-tools start -->';
const FENCE_END = '<!-- fw-dev-tools end -->';

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
  const content = block.trim() + '\n';
  const startIdx = existing.indexOf(FENCE_START);
  const endIdx = existing.indexOf(FENCE_END);

  if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
    const after = existing.slice(endIdx + FENCE_END.length).replace(/^\n/, '');
    return existing.slice(0, startIdx) + content + after;
  }

  // Append — ensure exactly one blank line separator from preceding content
  const separator = existing.length > 0 && !existing.endsWith('\n') ? '\n' : '';
  return existing + separator + content;
}

/**
 * Remove the fenced fw-dev-tools block from a string.
 * Collapses any resulting triple-newlines to double.
 *
 * @param {string} content
 * @returns {string}
 */
export function removeBlock(content) {
  const startIdx = content.indexOf(FENCE_START);
  const endIdx = content.indexOf(FENCE_END);
  if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) return content;
  const removed = content.slice(0, startIdx) + content.slice(endIdx + FENCE_END.length);
  return removed.replace(/\n{3,}/g, '\n\n');
}
