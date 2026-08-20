import { describe, expect, it } from 'vitest';

import { createDisplayOrderPatches } from '@/lib/create-display-order-patches';
import { getNextDisplayOrder } from '@/lib/get-next-display-order';
import { sortByDisplayOrder } from '@/lib/sort-by-display-order';

describe('display order helpers', () => {
  it('sorts by displayOrder then id', () => {
    const actual = sortByDisplayOrder([
      { id: 2, displayOrder: 1 },
      { id: 1, displayOrder: 0 },
      { id: 3, displayOrder: 1 },
    ]);
    expect(actual.map((item) => item.id)).toEqual([1, 2, 3]);
  });

  it('creates patches only for changed indexes', () => {
    const actual = createDisplayOrderPatches([
      { id: 2, displayOrder: 1 },
      { id: 1, displayOrder: 0 },
    ]);
    expect(actual).toEqual([
      { id: 2, displayOrder: 0 },
      { id: 1, displayOrder: 1 },
    ]);
  });

  it('returns the next display order after the current maximum', () => {
    expect(getNextDisplayOrder([])).toBe(0);
    expect(getNextDisplayOrder([{ displayOrder: 0 }, { displayOrder: 4 }])).toBe(5);
  });
});
