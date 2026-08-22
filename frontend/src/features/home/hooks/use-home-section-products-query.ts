import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import {
  getHomeSectionProductCategories,
  getHomeSectionProducts,
} from '@/features/home/api/home-section-products.api';
import type { GetPublicProductsQuery } from '@/generated/public-product.contract';

export function useHomeSectionProductsQuery(
  query: GetPublicProductsQuery = {},
  options: { readonly enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: queryKeys.public.products(query),
    queryFn: () => getHomeSectionProducts(query),
    retry: false,
    enabled: options.enabled ?? true,
  });
}

export function useHomeSectionProductCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.public.productCategories(),
    queryFn: getHomeSectionProductCategories,
    retry: false,
  });
}
