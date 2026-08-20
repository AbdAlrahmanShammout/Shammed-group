import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { createAdminProductCategory } from '@/features/categories/api/product-categories.api';
import type { CreateProductCategoryRequestDto } from '@/generated/admin-product-category.contract';

export function useCreateAdminProductCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductCategoryRequestDto) => createAdminProductCategory(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.productCategories() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.productCategories() });
    },
  });
}
