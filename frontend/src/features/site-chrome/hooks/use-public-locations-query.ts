import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getPublicLocations } from '@/features/site-chrome/api/locations.api';

export function usePublicLocationsQuery() {
  return useQuery({
    queryKey: queryKeys.public.locations(),
    queryFn: getPublicLocations,
    retry: false,
  });
}
