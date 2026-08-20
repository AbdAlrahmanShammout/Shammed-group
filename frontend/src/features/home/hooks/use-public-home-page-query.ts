import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getPublicHomePage } from '@/features/home/api/home-page.api';

export function usePublicHomePageQuery() {
  return useQuery({
    queryKey: queryKeys.public.homePage(),
    queryFn: getPublicHomePage,
    retry: false,
  });
}
