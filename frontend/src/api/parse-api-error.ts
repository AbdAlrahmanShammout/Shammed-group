import { ApiError } from '@/api/api-error';
import type { ApiErrorBody } from '@/generated/admin-auth.contract';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    isRecord(value) &&
    typeof value.message === 'string' &&
    typeof value.code === 'string' &&
    typeof value.statusCode === 'number'
  );
}

export async function parseApiError(response: Response): Promise<ApiError> {
  const body: unknown = await response.json().catch(() => null);
  if (isApiErrorBody(body)) {
    return new ApiError(body);
  }
  return new ApiError({
    message: 'Request failed',
    code: 'UNKNOWN_CODE',
    statusCode: response.status,
  });
}
