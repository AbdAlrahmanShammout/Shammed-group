import { describe, expect, it } from 'vitest';

import { buildPageTitle } from '@/lib/seo/build-page-title';

describe('buildPageTitle', () => {
  it('appends the site name to a page title', () => {
    expect(buildPageTitle('About')).toBe('About | Shammed Group');
  });

  it('returns the site name when the page title is empty', () => {
    expect(buildPageTitle('')).toBe('Shammed Group');
  });
});
