import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { deleteAdminSocialLink } from '@/features/social-links/api/social-links.api';

export function useDeleteAdminSocialLinkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (socialLinkId: number) => deleteAdminSocialLink(socialLinkId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.socialLinks() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.socialLinks() });
    },
  });
}
