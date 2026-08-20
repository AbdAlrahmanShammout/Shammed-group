import { useMutation, useQueryClient } from '@tanstack/react-query';

import { purgeUnreferencedAdminMedia } from '@/features/media-admin/api/media.api';

export function usePurgeUnreferencedMediaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purgeUnreferencedAdminMedia,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
    },
  });
}
