import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { updateAdminSocialLink } from '@/features/social-links/api/social-links.api';
import type { UpdateSocialLinkRequestDto } from '@/generated/admin-social-link.contract';

export function useUpdateAdminSocialLinkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      readonly socialLinkId: number;
      readonly body: UpdateSocialLinkRequestDto;
    }) => updateAdminSocialLink(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.socialLinks() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.socialLinks() });
    },
  });
}
