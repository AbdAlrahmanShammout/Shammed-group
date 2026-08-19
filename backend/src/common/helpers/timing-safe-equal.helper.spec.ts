import { isEqualTimingSafe } from '@/common/helpers/timing-safe-equal.helper';

describe('isEqualTimingSafe', () => {
  it('returns true for identical strings', () => {
    expect(isEqualTimingSafe('secret-password', 'secret-password')).toBe(true);
  });

  it('returns false for different strings of equal length', () => {
    expect(isEqualTimingSafe('secret-password', 'secret-passw0rd')).toBe(false);
  });

  it('returns false for strings of different length', () => {
    expect(isEqualTimingSafe('short', 'much-longer')).toBe(false);
  });
});
