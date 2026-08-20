import { describe, expect, it } from 'vitest';

import { parseCategoryIdSearchParam } from '@/features/products/lib/parse-category-id-search-param';

describe('parseCategoryIdSearchParam', () => {
  it('parses valid category identifiers', () => {
    expect(parseCategoryIdSearchParam('12')).toBe(12);
  });
  it('rejects missing or invalid values', () => {
    expect(parseCategoryIdSearchParam(null)).toBeUndefined();
    expect(parseCategoryIdSearchParam('')).toBeUndefined();
    expect(parseCategoryIdSearchParam('0')).toBeUndefined();
    expect(parseCategoryIdSearchParam('abc')).toBeUndefined();
  });
});
