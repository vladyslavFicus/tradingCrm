/**
 * Check if a node is a descendant of another node.
 *
 * @param {!Object} older - Potential ancestor of younger node
 * @param {!Object} younger - Potential descendant of older node
 *
 * @return {boolean}
 */
export function isDescendant(older, younger) {
  return (
    !!older.children
    && typeof older.children !== 'function'
    && older.children.some(
      child => child === younger || isDescendant(child, younger),
    )
  );
}
