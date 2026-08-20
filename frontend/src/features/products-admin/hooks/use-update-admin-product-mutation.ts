import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { updateAdminProduct } from '@/features/products-admin/api/products.api';
import type { UpdateProductRequestDto } from '@/generated/admin-product.contract';

export function useUpdateAdminProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { readonly productId: number; readonly body: UpdateProductRequestDto }) =>
      updateAdminProduct(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.products() });
      await queryClient.invalidateQueries({ queryKey: ['public', 'products'] });
      await queryClient.invalidateQueries({ queryKey: ['public', 'product'] });
    },
  });
}
