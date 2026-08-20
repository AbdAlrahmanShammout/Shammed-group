import { useMutation } from '@tanstack/react-query';

import { uploadAdminMedia } from '@/features/services-admin/api/media.api';

export function useUploadAdminMediaMutation() {
  return useMutation({
    mutationFn: (file: File) => uploadAdminMedia(file),
  });
}
