import { ApiProperty } from '@nestjs/swagger';

import { ProductCategoryResponse } from '@/modules/product-category/dto/response/model/product-category.response';
import { ProductCategoryEntity } from '@/modules/product-category/entity/product-category.entity';

export class ProductCategoryResponseDto {
  @ApiProperty({ type: () => ProductCategoryResponse })
  productCategory: ProductCategoryResponse;

  constructor(entity: ProductCategoryEntity) {
    this.productCategory = new ProductCategoryResponse(entity);
  }
}
