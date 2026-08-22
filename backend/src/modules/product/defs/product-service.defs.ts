export type CreateProductServiceInput = {
  readonly name: string;
  readonly shortDescription: string;
  readonly detailedDescription?: string;
  readonly manufacturer?: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly categoryId: number;
  readonly partnerId?: number;
  readonly imageMediaId?: number;
};

export type UpdateProductServiceInput = {
  readonly id: number;
  readonly name?: string;
  readonly shortDescription?: string;
  readonly detailedDescription?: string | null;
  readonly manufacturer?: string | null;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly categoryId?: number;
  readonly partnerId?: number | null;
  readonly imageMediaId?: number | null;
};

export type GetProductsServiceInput = {
  readonly isVisible?: boolean;
  readonly categoryId?: number;
  readonly partnerId?: number;
  readonly search?: string;
  readonly limit?: number;
  readonly offset?: number;
};
