import { toOptionalMediaId } from '@/features/products-admin/lib/to-optional-media-id';
import type { ProductFormValues } from '@/features/products-admin/schemas/product-form.schema';
import type { CreateProductRequestDto } from '@/generated/admin-product.contract';

function toOptionalText(value: string): string | undefined {
  return value === '' ? undefined : value;
}

export function toCreateProductRequest(values: ProductFormValues): CreateProductRequestDto {
  const imageMediaId = toOptionalMediaId(values.imageMediaId);
  const partnerId = values.partnerId === '' ? undefined : Number(values.partnerId);
  return {
    name: values.name,
    shortDescription: values.shortDescription,
    categoryId: Number(values.categoryId),
    detailedDescription: toOptionalText(values.detailedDescription),
    manufacturer: toOptionalText(values.manufacturer),
    isVisible: values.isVisible,
    displayOrder: values.displayOrder === '' ? 0 : Number(values.displayOrder),
    partnerId,
    imageMediaId: imageMediaId ?? undefined,
  };
}
