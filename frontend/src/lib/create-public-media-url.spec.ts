import { describe, expect, it } from 'vitest';

import { appEnv } from '@/config/env';
import { createPublicMediaUrl } from '@/lib/create-public-media-url';

describe('createPublicMediaUrl', () => {
  it('builds the public media file URL from the API base URL', () => {
    expect(createPublicMediaUrl(13)).toBe(`${appEnv.apiBaseUrl}/media/13`);
  });
});
