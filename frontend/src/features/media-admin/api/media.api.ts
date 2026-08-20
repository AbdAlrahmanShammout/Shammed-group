import { requestApi } from '@/api/http-client';
import type { GetMediaListResponseDto } from '@/generated/admin-media.contract';

const ADMIN_MEDIA_PATH = '/admin/media';

export async function getAdminMediaList(
  limit: number,
  offset: number,
): Promise<GetMediaListResponseDto> {
  return requestApi<GetMediaListResponseDto>({
    path: `${ADMIN_MEDIA_PATH}?limit=${limit}&offset=${offset}`,
    method: 'GET',
  });
}

export async function deleteAdminMedia(mediaId: number): Promise<void> {
  return requestApi<void>({
    path: `${ADMIN_MEDIA_PATH}/${mediaId}`,
    method: 'DELETE',
  });
}

export async function purgeUnreferencedAdminMedia(): Promise<void> {
  return requestApi<void>({
    path: ADMIN_MEDIA_PATH,
    method: 'DELETE',
  });
}
