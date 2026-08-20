import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { createAdminSiteSettings } from '@/features/settings/api/site-settings.api';
import type { CreateSiteSettingsRequestDto } from '@/generated/admin-site-settings.contract';

export function useCreateAdminSiteSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSiteSettingsRequestDto) => createAdminSiteSettings(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.siteSettings() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.siteSettings() });
    },
  });
}
