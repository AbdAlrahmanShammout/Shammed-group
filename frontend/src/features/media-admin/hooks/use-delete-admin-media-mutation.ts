import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { deleteAdminMedia } from '@/features/media-admin/api/media.api';

export function useDeleteAdminMediaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mediaId: number) => deleteAdminMedia(mediaId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
    },
  });
}
