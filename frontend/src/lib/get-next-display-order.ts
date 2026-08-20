/**
 * Next display order for a newly created admin list item.
 */
export function getNextDisplayOrder(
  items: readonly { readonly displayOrder: number }[],
): number {
  if (items.length === 0) {
    return 0;
  }
  return Math.max(...items.map((item) => item.displayOrder)) + 1;
}
