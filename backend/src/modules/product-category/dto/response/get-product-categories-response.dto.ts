import { ApiProperty } from '@nestjs/swagger';

import { ProductCategoryPage } from '@/modules/product-category/defs/product-category-repository.defs';
import { ProductCategoryResponse } from '@/modules/product-category/dto/response/model/product-category.response';

export class GetProductCategoriesResponseDto {
  @ApiProperty({ type: () => [ProductCategoryResponse] })
  productCategories: ProductCategoryResponse[];

  @ApiProperty({ description: 'Total rows matching the filter, across all pages', example: 4 })
  total: number;

  constructor(page: ProductCategoryPage) {
    this.productCategories = page.entities.map((entity) => new ProductCategoryResponse(entity));
    this.total = page.total;
  }
}
