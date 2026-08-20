import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminPartners } from '@/features/partners-admin/api/partners.api';

export function useAdminPartnersQuery() {
  return useQuery({
    queryKey: queryKeys.admin.partners(),
    queryFn: getAdminPartners,
    retry: false,
  });
}
