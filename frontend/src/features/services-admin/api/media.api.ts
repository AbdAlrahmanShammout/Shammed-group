import { requestMultipartApi } from '@/api/request-multipart-api';
import type { CreateMediaResponseDto } from '@/generated/admin-media.contract';

const ADMIN_MEDIA_PATH = '/admin/media';

export async function uploadAdminMedia(file: File): Promise<CreateMediaResponseDto> {
  const formData = new FormData();
  formData.append('file', file);
  return requestMultipartApi<CreateMediaResponseDto>({
    path: ADMIN_MEDIA_PATH,
    formData,
  });
}
