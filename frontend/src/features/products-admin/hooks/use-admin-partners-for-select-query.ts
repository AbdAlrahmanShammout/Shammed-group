import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminPartnersForSelect } from '@/features/products-admin/api/partners.api';

export function useAdminPartnersForSelectQuery() {
  return useQuery({
    queryKey: queryKeys.admin.partners(),
    queryFn: getAdminPartnersForSelect,
    retry: false,
  });
}
