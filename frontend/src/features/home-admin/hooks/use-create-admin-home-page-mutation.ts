import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { createAdminHomePage } from '@/features/home-admin/api/home-page.api';
import type { CreateHomePageRequestDto } from '@/generated/admin-home.contract';

export function useCreateAdminHomePageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateHomePageRequestDto) => createAdminHomePage(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.homePage() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.homePage() });
    },
  });
}
