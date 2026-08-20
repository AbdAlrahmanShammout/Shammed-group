import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getPublicPartners } from '@/features/partners/api/partners.api';

export function usePublicPartnersQuery() {
  return useQuery({
    queryKey: queryKeys.public.partners(),
    queryFn: getPublicPartners,
    retry: false,
  });
}
