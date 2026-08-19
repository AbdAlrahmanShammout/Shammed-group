import { BaseEntity } from '@/common/base/base.entity';
import { MediaEntity } from '@/modules/media/entity/media.entity';
import { PartnerEntity } from '@/modules/partner/entity/partner.entity';
import { ProductCategoryEntity } from '@/modules/product-category/entity/product-category.entity';
import { ProductZodType } from '@/modules/product/zod/product.zod';

export class ProductEntity extends BaseEntity {
  name!: string;
  shortDescription!: string;
  detailedDescription!: string | null;
  manufacturer!: string | null;
  isVisible!: boolean;
  displayOrder!: number;
  categoryId!: number;
  partnerId!: number | null;
  imageMediaId!: number | null;
  category?: ProductCategoryEntity;
  partner?: PartnerEntity;
  image?: MediaEntity;

  constructor(data: ProductZodType) {
    super();
    Object.assign(this, data);
  }
}
