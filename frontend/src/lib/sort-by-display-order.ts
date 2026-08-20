/**
 * Returns items sorted by displayOrder ascending, then id for stability.
 */
export function sortByDisplayOrder<T extends { readonly id: number; readonly displayOrder: number }>(
  items: readonly T[],
): T[] {
  return [...items].sort((left, right) => {
    if (left.displayOrder !== right.displayOrder) {
      return left.displayOrder - right.displayOrder;
    }
    return left.id - right.id;
  });
}
