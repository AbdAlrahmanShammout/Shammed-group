import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getPublicProducts } from '@/features/products/api/products.api';
import type { GetPublicProductsQuery } from '@/generated/public-product.contract';

export function usePublicProductsQuery(query: GetPublicProductsQuery = {}) {
  return useQuery({
    queryKey: queryKeys.public.products(query),
    queryFn: () => getPublicProducts(query),
    retry: false,
  });
}
