import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateProductCategoryRepoInput,
  GetProductCategoriesRepoInput,
  ProductCategoryPage,
  ReassignProductCategoryRepoInput,
  UpdateProductCategoryRepoInput,
} from '@/modules/product-category/defs/product-category-repository.defs';
import { ProductCategoryEntity } from '@/modules/product-category/entity/product-category.entity';

export abstract class ProductCategoryRepository {
  abstract create(
    input: CreateProductCategoryRepoInput,
    context?: TransactionContext,
  ): Promise<ProductCategoryEntity>;
  abstract findById(id: number): Promise<ProductCategoryEntity | null>;
  abstract findAll(input: GetProductCategoriesRepoInput): Promise<ProductCategoryPage>;
  abstract countAll(): Promise<number>;
  abstract countProducts(categoryId: number): Promise<number>;
  abstract update(
    input: UpdateProductCategoryRepoInput,
    context?: TransactionContext,
  ): Promise<ProductCategoryEntity>;
  abstract reassignProductsAndDelete(
    input: ReassignProductCategoryRepoInput,
    context?: TransactionContext,
  ): Promise<void>;
  abstract delete(id: number, context?: TransactionContext): Promise<void>;
}
