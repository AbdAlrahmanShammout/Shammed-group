import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminSiteSettings } from '@/features/settings/api/site-settings.api';

export function useAdminSiteSettingsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.siteSettings(),
    queryFn: getAdminSiteSettings,
    retry: false,
  });
}
