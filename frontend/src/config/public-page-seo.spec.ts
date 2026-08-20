import { describe, expect, it } from 'vitest';

import { appPaths } from '@/config/app-paths';
import { findPublicPageSeo, publicPageSeoCatalog } from '@/config/public-page-seo';

describe('publicPageSeoCatalog', () => {
  it('defines title and description for each major public page', () => {
    const expectedPaths = [
      appPaths.home,
      appPaths.about,
      appPaths.partners,
      appPaths.products,
      appPaths.services,
      appPaths.contact,
    ];
    expect(publicPageSeoCatalog.map((entry) => entry.path)).toEqual(expectedPaths);
    for (const entry of publicPageSeoCatalog) {
      expect(entry.title.trim().length).toBeGreaterThan(0);
      expect(entry.description.trim().length).toBeGreaterThan(0);
    }
  });

  it('finds SEO metadata by path', () => {
    expect(findPublicPageSeo(appPaths.about)?.title).toBe('About Shammed Group');
  });
});
