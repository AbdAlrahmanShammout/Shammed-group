import { describe, expect, it } from 'vitest';

import { appEnv } from '@/config/env';

describe('appEnv', () => {
  it('exposes an API base URL', () => {
    expect(appEnv.apiBaseUrl).toMatch(/^https?:\/\//);
  });
});
