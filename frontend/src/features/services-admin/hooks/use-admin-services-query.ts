import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminServices } from '@/features/services-admin/api/services.api';

export function useAdminServicesQuery() {
  return useQuery({
    queryKey: queryKeys.admin.services(),
    queryFn: getAdminServices,
    retry: false,
  });
}
