import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminProductCategories } from '@/features/categories/api/product-categories.api';

export function useAdminProductCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.admin.productCategories(),
    queryFn: getAdminProductCategories,
    retry: false,
  });
}
