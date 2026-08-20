import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminProductCategoriesForSelect } from '@/features/products-admin/api/product-categories.api';

export function useAdminProductCategoriesForSelectQuery() {
  return useQuery({
    queryKey: queryKeys.admin.productCategories(),
    queryFn: getAdminProductCategoriesForSelect,
    retry: false,
  });
}
