import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateProductRepoInput,
  GetProductsRepoInput,
  ProductPage,
  UpdateProductRepoInput,
} from '@/modules/product/defs/product-repository.defs';
import { ProductEntity } from '@/modules/product/entity/product.entity';

export abstract class ProductRepository {
  abstract create(
    input: CreateProductRepoInput,
    context?: TransactionContext,
  ): Promise<ProductEntity>;
  abstract findById(id: number): Promise<ProductEntity | null>;
  abstract findAll(input: GetProductsRepoInput): Promise<ProductPage>;
  abstract update(
    input: UpdateProductRepoInput,
    context?: TransactionContext,
  ): Promise<ProductEntity>;
  abstract delete(id: number, context?: TransactionContext): Promise<void>;
}
