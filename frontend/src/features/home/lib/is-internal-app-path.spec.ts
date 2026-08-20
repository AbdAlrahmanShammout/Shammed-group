import { describe, expect, it } from 'vitest';

import { isInternalAppPath } from '@/features/home/lib/is-internal-app-path';

describe('isInternalAppPath', () => {
  it('accepts absolute in-app paths', () => {
    expect(isInternalAppPath('/about')).toBe(true);
    expect(isInternalAppPath('/contact')).toBe(true);
  });
  it('rejects external and protocol-relative URLs', () => {
    expect(isInternalAppPath('https://example.com/about')).toBe(false);
    expect(isInternalAppPath('//cdn.example.com/asset')).toBe(false);
  });
});
