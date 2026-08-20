/**
 * Builds PATCH payloads that renumber displayOrder to match the current list index.
 */
export function createDisplayOrderPatches<
  T extends { readonly id: number; readonly displayOrder: number },
>(orderedItems: readonly T[]): Array<{ readonly id: number; readonly displayOrder: number }> {
  return orderedItems.flatMap((item, index) => {
    if (item.displayOrder === index) {
      return [];
    }
    return [{ id: item.id, displayOrder: index }];
  });
}
