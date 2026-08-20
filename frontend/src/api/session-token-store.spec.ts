import { afterEach, describe, expect, it } from 'vitest';

import { sessionTokenStore } from '@/api/session-token-store';

describe('sessionTokenStore', () => {
  afterEach(() => {
    sessionTokenStore.clear();
  });

  it('stores and clears the access token', () => {
    expect(sessionTokenStore.get()).toBeNull();
    sessionTokenStore.set('input-token');
    expect(sessionTokenStore.get()).toBe('input-token');
    sessionTokenStore.clear();
    expect(sessionTokenStore.get()).toBeNull();
  });
});
