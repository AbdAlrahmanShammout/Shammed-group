import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { apiConstants } from '@/api/consts';
import { requestApi } from '@/api/http-client';
import { sessionTokenStore } from '@/api/session-token-store';
import { setUnauthorizedHandler } from '@/api/unauthorized-handler';
import { appEnv } from '@/config/env';

describe('requestApi', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    sessionTokenStore.clear();
    setUnauthorizedHandler(null);
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it('attaches the bearer token when a session exists', async () => {
    sessionTokenStore.set('input-token');
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ id: 1, role: 'admin' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    await requestApi({ path: '/admin/auth/me', method: 'GET' });
    expect(fetchMock).toHaveBeenCalledWith(
      `${appEnv.apiBaseUrl}/admin/auth/me`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Headers),
      }),
    );
    const actualHeaders = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(actualHeaders.get('Authorization')).toBe('Bearer input-token');
  });

  it('clears the session through the unauthorized handler on 401 when a token was sent', async () => {
    sessionTokenStore.set('expired-token');
    const unauthorizedHandler = vi.fn();
    setUnauthorizedHandler(unauthorizedHandler);
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Authentication required',
          code: 'UNAUTHENTICATED',
          statusCode: apiConstants.unauthorizedStatusCode,
        }),
        { status: apiConstants.unauthorizedStatusCode, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    await expect(requestApi({ path: '/admin/auth/me', method: 'GET' })).rejects.toMatchObject({
      code: 'UNAUTHENTICATED',
      statusCode: apiConstants.unauthorizedStatusCode,
    });
    expect(unauthorizedHandler).toHaveBeenCalledOnce();
  });

  it('does not treat a login 401 as session expiry', async () => {
    const unauthorizedHandler = vi.fn();
    setUnauthorizedHandler(unauthorizedHandler);
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Authentication failed',
          code: 'UNAUTHENTICATED',
          statusCode: apiConstants.unauthorizedStatusCode,
        }),
        { status: apiConstants.unauthorizedStatusCode, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    await expect(
      requestApi({ path: '/admin/auth/login', method: 'POST', body: { password: 'wrong' } }),
    ).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
    expect(unauthorizedHandler).not.toHaveBeenCalled();
  });
});
