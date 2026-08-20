/**
 * Wire types for admin product-category operations on the admin OpenAPI document.
 * Keep aligned with /admin/product-category.
 * Do not import backend source types.
 */
export type ProductCategoryResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly name: string;
  readonly description?: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
};

export type ProductCategoryResponseDto = {
  readonly productCategory: ProductCategoryResponse;
};

export type GetProductCategoriesResponseDto = {
  readonly productCategories: readonly ProductCategoryResponse[];
  readonly total: number;
};

export type CreateProductCategoryRequestDto = {
  readonly name: string;
  readonly description?: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
};

export type UpdateProductCategoryRequestDto = {
  readonly name?: string;
  readonly description?: string | null;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
};

export type DeleteProductCategoryResponseDto = {
  readonly message: string;
  readonly status: string;
};
