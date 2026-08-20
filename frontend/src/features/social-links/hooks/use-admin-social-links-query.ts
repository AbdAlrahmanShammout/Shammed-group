import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminSocialLinks } from '@/features/social-links/api/social-links.api';

export function useAdminSocialLinksQuery() {
  return useQuery({
    queryKey: queryKeys.admin.socialLinks(),
    queryFn: getAdminSocialLinks,
    retry: false,
  });
}
