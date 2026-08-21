import { appEnv } from '@/config/env';

/**
 * Builds the public absolute URL for a media file served by GET /media/:id.
 * Pass `width` to request a WebP variant resized to that pixel width.
 */
export function createPublicMediaUrl(mediaId: number, width?: number): string {
  const base = `${appEnv.apiBaseUrl}/media/${mediaId}`;
  return width !== undefined ? `${base}?w=${width}` : base;
}
