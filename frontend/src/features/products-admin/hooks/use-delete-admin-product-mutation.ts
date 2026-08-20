import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { deleteAdminProduct } from '@/features/products-admin/api/products.api';

export function useDeleteAdminProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => deleteAdminProduct(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.products() });
      await queryClient.invalidateQueries({ queryKey: ['public', 'products'] });
      await queryClient.invalidateQueries({ queryKey: ['public', 'product'] });
    },
  });
}
