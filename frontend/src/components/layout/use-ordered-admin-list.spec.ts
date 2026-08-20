import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useOrderedAdminList } from '@/components/layout/use-ordered-admin-list';

type ListItem = {
  readonly id: number;
  readonly displayOrder: number;
  readonly isVisible: boolean;
  readonly name: string;
};

describe('useOrderedAdminList', () => {
  it('refreshes isVisible from server data without changing list order', async () => {
    const onPersist = vi.fn(async () => undefined);
    const initialItems: ListItem[] = [
      { id: 1, displayOrder: 0, isVisible: false, name: 'A' },
      { id: 2, displayOrder: 1, isVisible: false, name: 'B' },
    ];
    const { result, rerender } = renderHook(
      ({ items }) => useOrderedAdminList({ items, onPersist }),
      { initialProps: { items: initialItems } },
    );
    expect(result.current.orderedItems[0]?.isVisible).toBe(false);
    const updatedItems: ListItem[] = [
      { id: 1, displayOrder: 0, isVisible: true, name: 'A' },
      { id: 2, displayOrder: 1, isVisible: false, name: 'B' },
    ];
    rerender({ items: updatedItems });
    await waitFor(() => {
      expect(result.current.orderedItems[0]?.isVisible).toBe(true);
    });
    expect(result.current.orderedItems.map((item) => item.id)).toEqual([1, 2]);
  });

  it('persists display order patches after reorder', async () => {
    const onPersist = vi.fn(async () => undefined);
    const items: ListItem[] = [
      { id: 1, displayOrder: 0, isVisible: true, name: 'A' },
      { id: 2, displayOrder: 1, isVisible: true, name: 'B' },
    ];
    const { result } = renderHook(() => useOrderedAdminList({ items, onPersist }));
    await act(async () => {
      await result.current.reorder([items[1]!, items[0]!]);
    });
    expect(onPersist).toHaveBeenCalledWith([
      { id: 2, displayOrder: 0 },
      { id: 1, displayOrder: 1 },
    ]);
    expect(result.current.orderedItems.map((item) => item.id)).toEqual([2, 1]);
  });
});
