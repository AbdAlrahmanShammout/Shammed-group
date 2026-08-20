import { appEnv } from '@/config/env';

/**
 * Builds the public absolute URL for a media file served by GET /media/:id.
 */
export function createPublicMediaUrl(mediaId: number): string {
  return `${appEnv.apiBaseUrl}/media/${mediaId}`;
}
