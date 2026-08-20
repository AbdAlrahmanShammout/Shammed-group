/**
 * Wire types for admin auth operations on the admin OpenAPI document.
 * Keep aligned with POST /admin/auth/login and GET /admin/auth/me.
 * Do not import backend source types.
 */
export type LoginRequestDto = {
  readonly password: string;
};

export type LoginResponseDto = {
  readonly accessToken: string;
};

export type AuthSessionResponseDto = {
  readonly id: number;
  readonly role: string;
};

export type ApiValidationErrorObject = {
  readonly property: string;
  readonly constraints: Record<string, string>;
};

export type ApiErrorBody = {
  readonly message: string;
  readonly code: string;
  readonly statusCode: number;
  readonly stack?: string;
  readonly validationErrorObjects?: readonly ApiValidationErrorObject[];
};
