import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getPublicSocialLinks } from '@/features/site-chrome/api/social-links.api';

export function usePublicSocialLinksQuery() {
  return useQuery({
    queryKey: queryKeys.public.socialLinks(),
    queryFn: getPublicSocialLinks,
    retry: false,
  });
}
