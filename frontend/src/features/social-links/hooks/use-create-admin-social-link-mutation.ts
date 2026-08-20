import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { createAdminSocialLink } from '@/features/social-links/api/social-links.api';
import type { CreateSocialLinkRequestDto } from '@/generated/admin-social-link.contract';

export function useCreateAdminSocialLinkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSocialLinkRequestDto) => createAdminSocialLink(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.socialLinks() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.socialLinks() });
    },
  });
}
