/**
 * Wire types for admin product operations on the admin OpenAPI document.
 * Keep aligned with /admin/product.
 * Do not import backend source types.
 */
import type { MediaResponse } from '@/generated/admin-media.contract';
import type { ProductCategoryResponse } from '@/generated/admin-product-category.contract';
import type { PartnerResponse } from '@/generated/admin-partner.contract';

export type ProductResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly name: string;
  readonly shortDescription: string;
  readonly detailedDescription?: string;
  readonly manufacturer?: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
  readonly categoryId: number;
  readonly partnerId?: number;
  readonly imageMediaId?: number;
  readonly category: ProductCategoryResponse;
  readonly partner?: PartnerResponse;
  readonly image?: MediaResponse;
};

export type ProductResponseDto = {
  readonly product: ProductResponse;
};

export type GetProductsResponseDto = {
  readonly products: readonly ProductResponse[];
  readonly total: number;
};

export type CreateProductRequestDto = {
  readonly name: string;
  readonly shortDescription: string;
  readonly categoryId: number;
  readonly detailedDescription?: string;
  readonly manufacturer?: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly partnerId?: number;
  readonly imageMediaId?: number;
};

export type UpdateProductRequestDto = {
  readonly name?: string;
  readonly shortDescription?: string;
  readonly categoryId?: number;
  readonly detailedDescription?: string | null;
  readonly manufacturer?: string | null;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly partnerId?: number | null;
  readonly imageMediaId?: number | null;
};

export type DeleteProductResponseDto = {
  readonly message: string;
  readonly status: string;
};
