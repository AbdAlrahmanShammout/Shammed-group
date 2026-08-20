import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getPublicProductCategories } from '@/features/products/api/product-categories.api';

export function usePublicProductCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.public.productCategories(),
    queryFn: getPublicProductCategories,
    retry: false,
  });
}
