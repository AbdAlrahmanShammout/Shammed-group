import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getPublicAboutPage } from '@/features/about/api/about-page.api';

export function usePublicAboutPageQuery() {
  return useQuery({
    queryKey: queryKeys.public.aboutPage(),
    queryFn: getPublicAboutPage,
    retry: false,
  });
}
