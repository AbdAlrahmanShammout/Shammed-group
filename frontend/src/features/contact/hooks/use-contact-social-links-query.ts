import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getContactSocialLinks } from '@/features/contact/api/contact-social-links.api';

export function useContactSocialLinksQuery() {
  return useQuery({
    queryKey: queryKeys.public.socialLinks(),
    queryFn: getContactSocialLinks,
    retry: false,
  });
}
