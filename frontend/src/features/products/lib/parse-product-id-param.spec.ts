import { describe, expect, it } from 'vitest';

import { parseProductIdParam } from '@/features/products/lib/parse-product-id-param';

describe('parseProductIdParam', () => {
  it('parses valid product identifiers', () => {
    expect(parseProductIdParam('42')).toBe(42);
  });
  it('rejects missing or invalid values', () => {
    expect(parseProductIdParam(undefined)).toBeUndefined();
    expect(parseProductIdParam('')).toBeUndefined();
    expect(parseProductIdParam('0')).toBeUndefined();
    expect(parseProductIdParam('abc')).toBeUndefined();
  });
});
