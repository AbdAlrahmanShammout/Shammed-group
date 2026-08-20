import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { PageSeo } from '@/components/seo/page-seo';
import { appEnv } from '@/config/env';

describe('PageSeo', () => {
  afterEach(() => {
    document.title = '';
    document.head.querySelectorAll('meta[name="description"], meta[property], link[rel="canonical"]').forEach((element) => {
      element.remove();
    });
  });

  it('exposes document title, description, and Open Graph tags', () => {
    render(
      <PageSeo
        description="About Shammed Group company overview."
        path="/about"
        title="About"
      />,
    );
    expect(document.title).toBe('About | Shammed Group');
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'About Shammed Group company overview.',
    );
    expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'About | Shammed Group',
    );
    expect(
      document.head.querySelector('meta[property="og:description"]')?.getAttribute('content'),
    ).toBe('About Shammed Group company overview.');
    expect(document.head.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
      `${appEnv.publicSiteUrl}/about`,
    );
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${appEnv.publicSiteUrl}/about`,
    );
  });
});
