import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { deleteAdminProductCategory } from '@/features/categories/api/product-categories.api';

export function useDeleteAdminProductCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { readonly categoryId: number; readonly replacementCategoryId?: number }) =>
      deleteAdminProductCategory(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.productCategories() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.productCategories() });
    },
  });
}
