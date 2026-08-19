import { ApiProperty } from '@nestjs/swagger';

import { ProductPage } from '@/modules/product/defs/product-repository.defs';
import { ProductResponse } from '@/modules/product/dto/response/model/product.response';

export class GetProductsResponseDto {
  @ApiProperty({ type: () => [ProductResponse] })
  products: ProductResponse[];

  @ApiProperty({ description: 'Total rows matching the filter, across all pages', example: 4 })
  total: number;

  constructor(page: ProductPage) {
    this.products = page.entities.map((entity) => new ProductResponse(entity));
    this.total = page.total;
  }
}
