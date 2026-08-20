/**
 * Wire types for admin media operations.
 * Keep aligned with GET/POST/DELETE /admin/media.
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

export type GetMediaListResponseDto = {
  readonly mediaList: readonly MediaResponse[];
  readonly total: number;
};
