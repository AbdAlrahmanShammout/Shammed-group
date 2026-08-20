import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getPublicSiteSettings } from '@/features/site-chrome/api/site-settings.api';

export function usePublicSiteSettingsQuery() {
  return useQuery({
    queryKey: queryKeys.public.siteSettings(),
    queryFn: getPublicSiteSettings,
    retry: false,
  });
}
