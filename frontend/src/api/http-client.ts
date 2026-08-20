import { apiConstants } from '@/api/consts';
import { parseApiError } from '@/api/parse-api-error';
import { sessionTokenStore } from '@/api/session-token-store';
import { notifyUnauthorized } from '@/api/unauthorized-handler';
import { appEnv } from '@/config/env';

export type HttpRequestInput = {
  readonly path: string;
  readonly method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  readonly body?: unknown;
};

function createRequestUrl(path: string): string {
  const normalizedBaseUrl = appEnv.apiBaseUrl.replace(/\/$/, '');
  return `${normalizedBaseUrl}${path}`;
}

export async function requestApi<T>(input: HttpRequestInput): Promise<T> {
  const accessToken = sessionTokenStore.get();
  const headers = new Headers({ Accept: 'application/json' });
  if (input.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  const response = await fetch(createRequestUrl(input.path), {
    method: input.method,
    headers,
    body: input.body === undefined ? undefined : JSON.stringify(input.body),
  });
  if (!response.ok) {
    const error = await parseApiError(response);
    if (error.statusCode === apiConstants.unauthorizedStatusCode && accessToken) {
      notifyUnauthorized();
    }
    throw error;
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
