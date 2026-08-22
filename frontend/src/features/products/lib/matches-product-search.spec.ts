import { describe, expect, it } from 'vitest';

import { matchesProductSearch } from '@/features/products/lib/matches-product-search';

describe('matchesProductSearch', () => {
  const product = {
    name: 'Amoxicillin 500 mg',
    shortDescription: 'Broad-spectrum antibiotic capsules',
    detailedDescription: 'Used for bacterial infections',
    manufacturer: 'Example Pharma',
  };

  it('matches product name case-insensitively', () => {
    expect(matchesProductSearch(product, 'amoxicillin')).toBe(true);
  });

  it('matches manufacturer and description fields', () => {
    expect(matchesProductSearch(product, 'example pharma')).toBe(true);
    expect(matchesProductSearch(product, 'bacterial')).toBe(true);
  });

  it('returns true for blank search queries', () => {
    expect(matchesProductSearch(product, '   ')).toBe(true);
  });

  it('returns false when no field matches', () => {
    expect(matchesProductSearch(product, 'stethoscope')).toBe(false);
  });
});
