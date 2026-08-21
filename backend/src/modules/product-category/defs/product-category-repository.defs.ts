import { ProductCategoryEntity } from '@/modules/product-category/entity/product-category.entity';

export type CreateProductCategoryRepoInput = {
  readonly name: string;
  readonly description: string | null;
  readonly isVisible: boolean;
  readonly displayOrder: number;
  readonly color: string | null;
};

export type UpdateProductCategoryRepoInput = {
  readonly id: number;
  readonly name?: string;
  readonly description?: string | null;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly color?: string | null;
};

export type GetProductCategoriesRepoInput = {
  readonly isVisible?: boolean;
  readonly limit: number;
  readonly offset: number;
};

export type ReassignProductCategoryRepoInput = {
  readonly id: number;
  readonly replacementCategoryId: number;
};

export type ProductCategoryPage = {
  readonly entities: ProductCategoryEntity[];
  readonly total: number;
};
