import { describe, expect, it } from 'vitest';

import { appEnv } from '@/config/env';

describe('appEnv', () => {
  it('exposes an API base URL', () => {
    expect(appEnv.apiBaseUrl).toMatch(/^https?:\/\//);
  });

  it('exposes a public site URL for SEO absolute links', () => {
    expect(appEnv.publicSiteUrl).toMatch(/^https?:\/\//);
    expect(appEnv.publicSiteUrl.endsWith('/')).toBe(false);
  });
});
