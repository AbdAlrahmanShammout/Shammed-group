import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminAboutPage } from '@/features/about-admin/api/about-page.api';

export function useAdminAboutPageQuery() {
  return useQuery({
    queryKey: queryKeys.admin.aboutPage(),
    queryFn: getAdminAboutPage,
    retry: false,
  });
}
