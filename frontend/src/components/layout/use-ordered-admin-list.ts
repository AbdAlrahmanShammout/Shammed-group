import { useEffect, useMemo, useState } from 'react';

import { createDisplayOrderPatches } from '@/lib/create-display-order-patches';
import { sortByDisplayOrder } from '@/lib/sort-by-display-order';

const EMPTY_ADMIN_LIST_ITEMS: readonly never[] = [];

type UseOrderedAdminListInput<T extends { readonly id: number; readonly displayOrder: number }> = {
  readonly items: readonly T[] | undefined;
  readonly onPersist: (
    patches: ReadonlyArray<{ readonly id: number; readonly displayOrder: number }>,
  ) => Promise<void>;
};

type UseOrderedAdminListResult<T extends { readonly id: number; readonly displayOrder: number }> = {
  readonly error: string | null;
  readonly isSaving: boolean;
  readonly orderedItems: T[];
  readonly reorder: (nextItems: T[]) => Promise<void>;
};

/**
 * Keeps a sorted admin list in sync and persists displayOrder changes after drag-and-drop.
 */
export function useOrderedAdminList<T extends { readonly id: number; readonly displayOrder: number }>(
  input: UseOrderedAdminListInput<T>,
): UseOrderedAdminListResult<T> {
  const sourceItems = (input.items ?? EMPTY_ADMIN_LIST_ITEMS) as readonly T[];
  const itemsSignature = sourceItems
    .map((item) => `${item.id}:${item.displayOrder}`)
    .join('|');
  const sortedItems = useMemo(
    () => sortByDisplayOrder(sourceItems),
    // Signature captures id/order content so temporary empty-array identities do not reset state.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional signature dependency
    [itemsSignature],
  );
  const [orderedItems, setOrderedItems] = useState<T[]>(sortedItems);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    setOrderedItems(sortedItems);
  }, [sortedItems]);
  async function reorder(nextItems: T[]): Promise<void> {
    const previousItems = orderedItems;
    const patches = createDisplayOrderPatches(nextItems);
    const renumberedItems = nextItems.map((item, index) => ({
      ...item,
      displayOrder: index,
    })) as T[];
    setOrderedItems(renumberedItems);
    if (patches.length === 0) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await input.onPersist(patches);
    } catch {
      setOrderedItems(previousItems);
      setError('Unable to save the new order.');
    } finally {
      setIsSaving(false);
    }
  }
  return {
    error,
    isSaving,
    orderedItems,
    reorder,
  };
}
