import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminProducts } from '@/features/products-admin/api/products.api';

export function useAdminProductsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.products(),
    queryFn: getAdminProducts,
    retry: false,
  });
}
