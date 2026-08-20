import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminLocations } from '@/features/locations/api/locations.api';

export function useAdminLocationsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.locations(),
    queryFn: getAdminLocations,
    retry: false,
  });
}
