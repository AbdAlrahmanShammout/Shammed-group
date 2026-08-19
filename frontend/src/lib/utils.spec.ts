import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges overlapping Tailwind classes', () => {
    const actual = cn('p-2', 'p-4');
    expect(actual).toBe('p-4');
  });
});
