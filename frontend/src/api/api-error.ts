import type { ApiErrorBody, ApiValidationErrorObject } from '@/generated/admin-auth.contract';

export class ApiError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly validationErrorObjects: readonly ApiValidationErrorObject[];

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.code = body.code;
    this.statusCode = body.statusCode;
    this.validationErrorObjects = body.validationErrorObjects ?? [];
  }
}
