import type { CategoryFormValues } from '@/features/categories/schemas/category-form.schema';
import type { UpdateProductCategoryRequestDto } from '@/generated/admin-product-category.contract';

export function toUpdateCategoryRequest(
  values: CategoryFormValues,
): UpdateProductCategoryRequestDto {
  return {
    name: values.name,
    description: values.description === '' ? null : values.description,
    isVisible: values.isVisible,
    displayOrder: values.displayOrder === '' ? 0 : Number(values.displayOrder),
    color: values.color,
  };
}
