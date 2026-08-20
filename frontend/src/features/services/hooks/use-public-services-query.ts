import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getPublicServices } from '@/features/services/api/services.api';

export function usePublicServicesQuery() {
  return useQuery({
    queryKey: queryKeys.public.services(),
    queryFn: getPublicServices,
    retry: false,
  });
}
