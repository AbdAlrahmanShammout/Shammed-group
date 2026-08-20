import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminHomePage } from '@/features/home-admin/api/home-page.api';

export function useAdminHomePageQuery() {
  return useQuery({
    queryKey: queryKeys.admin.homePage(),
    queryFn: getAdminHomePage,
    retry: false,
  });
}
