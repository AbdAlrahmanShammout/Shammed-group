import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getContactSiteSettings } from '@/features/contact/api/contact-site-settings.api';

export function useContactSiteSettingsQuery() {
  return useQuery({
    queryKey: queryKeys.public.siteSettings(),
    queryFn: getContactSiteSettings,
    retry: false,
  });
}
