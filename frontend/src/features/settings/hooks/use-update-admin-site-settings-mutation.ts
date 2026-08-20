import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { updateAdminSiteSettings } from '@/features/settings/api/site-settings.api';
import type { UpdateSiteSettingsRequestDto } from '@/generated/admin-site-settings.contract';

export function useUpdateAdminSiteSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateSiteSettingsRequestDto) => updateAdminSiteSettings(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.siteSettings() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.siteSettings() });
    },
  });
}
