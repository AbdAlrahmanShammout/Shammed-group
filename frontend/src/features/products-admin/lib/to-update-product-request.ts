import { toOptionalMediaId } from '@/features/products-admin/lib/to-optional-media-id';
import type { ProductFormValues } from '@/features/products-admin/schemas/product-form.schema';
import type { UpdateProductRequestDto } from '@/generated/admin-product.contract';

function toNullableText(value: string): string | null {
  return value === '' ? null : value;
}

export function toUpdateProductRequest(values: ProductFormValues): UpdateProductRequestDto {
  return {
    name: values.name,
    shortDescription: values.shortDescription,
    categoryId: Number(values.categoryId),
    detailedDescription: toNullableText(values.detailedDescription),
    manufacturer: toNullableText(values.manufacturer),
    isVisible: values.isVisible,
    displayOrder: values.displayOrder === '' ? 0 : Number(values.displayOrder),
    partnerId: values.partnerId === '' ? null : Number(values.partnerId),
    imageMediaId: toOptionalMediaId(values.imageMediaId),
  };
}
