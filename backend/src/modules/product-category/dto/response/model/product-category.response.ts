import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseModelResponseDto } from '@/common/base/base-model-response.dto';
import { ProductCategoryEntity } from '@/modules/product-category/entity/product-category.entity';

export class ProductCategoryResponse extends BaseModelResponseDto {
  @ApiProperty({ description: 'Category name', example: 'Pharmaceutical Products' })
  name: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Medicines distributed by Shammed Group',
  })
  description?: string;

  @ApiProperty({ description: 'Whether the category is public', example: true })
  isVisible: boolean;

  @ApiProperty({ description: 'Sort order among categories', example: 0 })
  displayOrder: number;

  constructor(data: ProductCategoryEntity) {
    super(data);
    this.name = data.name;
    this.description = data.description ?? undefined;
    this.isVisible = data.isVisible;
    this.displayOrder = data.displayOrder;
  }
}
