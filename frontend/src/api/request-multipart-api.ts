import { apiConstants } from '@/api/consts';
import { parseApiError } from '@/api/parse-api-error';
import { sessionTokenStore } from '@/api/session-token-store';
import { notifyUnauthorized } from '@/api/unauthorized-handler';
import { appEnv } from '@/config/env';

export type MultipartRequestInput = {
  readonly path: string;
  readonly formData: FormData;
};

function createRequestUrl(path: string): string {
  const normalizedBaseUrl = appEnv.apiBaseUrl.replace(/\/$/, '');
  return `${normalizedBaseUrl}${path}`;
}

/**
 * Sends multipart form data without setting Content-Type so the browser can
 * attach the multipart boundary.
 */
export async function requestMultipartApi<T>(input: MultipartRequestInput): Promise<T> {
  const accessToken = sessionTokenStore.get();
  const headers = new Headers({ Accept: 'application/json' });
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  const response = await fetch(createRequestUrl(input.path), {
    method: 'POST',
    headers,
    body: input.formData,
  });
  if (!response.ok) {
    const error = await parseApiError(response);
    if (error.statusCode === apiConstants.unauthorizedStatusCode && accessToken) {
      notifyUnauthorized();
    }
    throw error;
  }
  return (await response.json()) as T;
}
