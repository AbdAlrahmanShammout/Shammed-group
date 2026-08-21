/**
 * Wire types for GET /product and GET /product-category.
 * Keep aligned with the public Product OpenAPI documents.
 * Do not import backend source types.
 */
import type { MediaResponse } from '@/generated/public-site.contract';
import type { PartnerResponse } from '@/generated/public-partner.contract';

export type ProductCategoryResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly name: string;
  readonly description?: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
  readonly color?: string;
};

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

export type GetProductsResponseDto = {
  readonly products: readonly ProductResponse[];
  readonly total: number;
};

export type GetProductCategoriesResponseDto = {
  readonly productCategories: readonly ProductCategoryResponse[];
  readonly total: number;
};

export type GetPublicProductsQuery = {
  readonly categoryId?: number;
};

export type ProductResponseDto = {
  readonly product: ProductResponse;
};
