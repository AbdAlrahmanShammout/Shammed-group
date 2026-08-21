import { ProductCategoryEntity } from '@/modules/product-category/entity/product-category.entity';
import type { ProductCategoryType } from '@/modules/product-category/types/product-category-details-schema.type';

export class ProductCategoryMapper {
  static toEntity(schema: ProductCategoryType): ProductCategoryEntity {
    return new ProductCategoryEntity({
      id: schema.id,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      name: schema.name,
      description: schema.description ?? null,
      isVisible: schema.isVisible,
      displayOrder: schema.displayOrder,
      color: schema.color ?? null,
    });
  }
}
