import type { CategoryFormValues } from '@/features/categories/schemas/category-form.schema';
import type { CreateProductCategoryRequestDto } from '@/generated/admin-product-category.contract';

export function toCreateCategoryRequest(
  values: CategoryFormValues,
): CreateProductCategoryRequestDto {
  return {
    name: values.name,
    description: values.description === '' ? undefined : values.description,
    isVisible: values.isVisible,
    displayOrder: values.displayOrder === '' ? 0 : Number(values.displayOrder),
  };
}
