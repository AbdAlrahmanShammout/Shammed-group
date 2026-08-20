import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { updateAdminProductCategory } from '@/features/categories/api/product-categories.api';
import type { UpdateProductCategoryRequestDto } from '@/generated/admin-product-category.contract';

export function useUpdateAdminProductCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      readonly categoryId: number;
      readonly body: UpdateProductCategoryRequestDto;
    }) => updateAdminProductCategory(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.productCategories() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.productCategories() });
    },
  });
}
