import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { updateAdminAboutPage } from '@/features/about-admin/api/about-page.api';
import type { UpdateAboutPageRequestDto } from '@/generated/admin-about.contract';

export function useUpdateAdminAboutPageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAboutPageRequestDto) => updateAdminAboutPage(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.aboutPage() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.aboutPage() });
    },
  });
}
