/**
 * Wire types for admin media upload on the admin OpenAPI document.
 * Keep aligned with POST /admin/media.
 * Do not import backend source types.
 */
export type MediaResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly originalFileName: string;
  readonly mimeType: string;
  readonly byteSize: number;
};

export type CreateMediaResponseDto = {
  readonly media: MediaResponse;
};
