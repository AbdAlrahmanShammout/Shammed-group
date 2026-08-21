export type CreateProductCategoryServiceInput = {
  readonly name: string;
  readonly description?: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly color?: string;
};

export type UpdateProductCategoryServiceInput = {
  readonly id: number;
  readonly name?: string;
  readonly description?: string | null;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly color?: string | null;
};

export type GetProductCategoriesServiceInput = {
  readonly isVisible?: boolean;
  readonly limit?: number;
  readonly offset?: number;
};

export type DeleteProductCategoryServiceInput = {
  readonly id: number;
  readonly replacementCategoryId?: number;
};
