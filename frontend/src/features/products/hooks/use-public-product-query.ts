import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getPublicProductById } from '@/features/products/api/products.api';

export function usePublicProductQuery(productId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.public.product(productId ?? 0),
    queryFn: () => getPublicProductById(productId as number),
    enabled: typeof productId === 'number',
    retry: false,
  });
}
