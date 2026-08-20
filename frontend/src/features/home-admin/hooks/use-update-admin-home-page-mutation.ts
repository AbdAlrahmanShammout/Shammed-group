import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { updateAdminHomePage } from '@/features/home-admin/api/home-page.api';
import type { UpdateHomePageRequestDto } from '@/generated/admin-home.contract';

export function useUpdateAdminHomePageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateHomePageRequestDto) => updateAdminHomePage(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.homePage() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.homePage() });
    },
  });
}
