import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { createAdminAboutPage } from '@/features/about-admin/api/about-page.api';
import type { CreateAboutPageRequestDto } from '@/generated/admin-about.contract';

export function useCreateAdminAboutPageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAboutPageRequestDto) => createAdminAboutPage(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.aboutPage() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.aboutPage() });
    },
  });
}
