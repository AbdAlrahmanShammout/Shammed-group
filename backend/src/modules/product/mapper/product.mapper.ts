import { MediaMapper } from '@/modules/media/mapper/media.mapper';
import { PartnerMapper } from '@/modules/partner/mapper/partner.mapper';
import { ProductCategoryMapper } from '@/modules/product-category/mapper/product-category.mapper';
import { ProductEntity } from '@/modules/product/entity/product.entity';
import type { ProductType } from '@/modules/product/types/product-details-schema.type';

export class ProductMapper {
  static toEntity(schema: ProductType): ProductEntity {
    return new ProductEntity({
      id: schema.id,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      name: schema.name,
      shortDescription: schema.shortDescription,
      detailedDescription: schema.detailedDescription ?? null,
      manufacturer: schema.manufacturer ?? null,
      isVisible: schema.isVisible,
      displayOrder: schema.displayOrder,
      categoryId: schema.categoryId,
      partnerId: schema.partnerId ?? null,
      imageMediaId: schema.imageMediaId ?? null,
      category: schema.category ? ProductCategoryMapper.toEntity(schema.category) : undefined,
      partner: schema.partner ? PartnerMapper.toEntity(schema.partner) : undefined,
      image: schema.image ? MediaMapper.toEntity(schema.image) : undefined,
    });
  }
}
