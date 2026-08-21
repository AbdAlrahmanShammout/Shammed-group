import { BaseEntity } from '@/common/base/base.entity';
import { ProductCategoryZodType } from '@/modules/product-category/zod/product-category.zod';

export class ProductCategoryEntity extends BaseEntity {
  name!: string;
  description!: string | null;
  isVisible!: boolean;
  displayOrder!: number;
  color!: string | null;

  constructor(data: ProductCategoryZodType) {
    super();
    Object.assign(this, data);
  }
}
