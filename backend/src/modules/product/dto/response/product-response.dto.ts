import { ApiProperty } from '@nestjs/swagger';

import { ProductResponse } from '@/modules/product/dto/response/model/product.response';
import { ProductEntity } from '@/modules/product/entity/product.entity';

export class ProductResponseDto {
  @ApiProperty({ type: () => ProductResponse })
  product: ProductResponse;

  constructor(entity: ProductEntity) {
    this.product = new ProductResponse(entity);
  }
}
