import { ProductEntity } from '@/modules/product/entity/product.entity';

export type CreateProductRepoInput = {
  readonly name: string;
  readonly shortDescription: string;
  readonly detailedDescription: string | null;
  readonly manufacturer: string | null;
  readonly isVisible: boolean;
  readonly displayOrder: number;
  readonly categoryId: number;
  readonly partnerId: number | null;
  readonly imageMediaId: number | null;
};

export type UpdateProductRepoInput = {
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

export type GetProductsRepoInput = {
  readonly isVisible?: boolean;
  readonly isCategoryVisible?: boolean;
  readonly categoryId?: number;
  readonly limit: number;
  readonly offset: number;
};

export type ProductPage = {
  readonly entities: ProductEntity[];
  readonly total: number;
};
