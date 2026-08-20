import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { createAdminProduct } from '@/features/products-admin/api/products.api';
import type { CreateProductRequestDto } from '@/generated/admin-product.contract';

export function useCreateAdminProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductRequestDto) => createAdminProduct(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.products() });
      await queryClient.invalidateQueries({ queryKey: ['public', 'products'] });
    },
  });
}
