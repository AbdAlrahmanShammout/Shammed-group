import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseModelResponseDto } from '@/common/base/base-model-response.dto';
import { MediaResponse } from '@/modules/media/dto/response/model/media.response';
import { PartnerResponse } from '@/modules/partner/dto/response/model/partner.response';
import { ProductCategoryResponse } from '@/modules/product-category/dto/response/model/product-category.response';
import { ProductEntity } from '@/modules/product/entity/product.entity';

export class ProductResponse extends BaseModelResponseDto {
  @ApiProperty({ description: 'Product name', example: 'Amoxicillin 500 mg' })
  name: string;

  @ApiProperty({
    description: 'Short public description',
    example: 'Broad-spectrum antibiotic capsules',
  })
  shortDescription: string;

  @ApiPropertyOptional({
    description: 'Detailed public description',
    example: 'Used under medical supervision for bacterial infections.',
  })
  detailedDescription?: string;

  @ApiPropertyOptional({ description: 'Manufacturer name', example: 'Example Pharma' })
  manufacturer?: string;

  @ApiProperty({ description: 'Whether the product is public', example: true })
  isVisible: boolean;

  @ApiProperty({ description: 'Sort order among products', example: 0 })
  displayOrder: number;

  @ApiProperty({ description: 'Product category identifier', example: 1 })
  categoryId: number;

  @ApiPropertyOptional({ description: 'Associated partner identifier', example: 1 })
  partnerId?: number;

  @ApiPropertyOptional({ description: 'Product image media identifier', example: 1 })
  imageMediaId?: number;

  @ApiProperty({ type: () => ProductCategoryResponse })
  category: ProductCategoryResponse;

  @ApiPropertyOptional({ type: () => PartnerResponse })
  partner?: PartnerResponse;

  @ApiPropertyOptional({ type: () => MediaResponse })
  image?: MediaResponse;

  constructor(data: ProductEntity) {
    super(data);
    this.name = data.name;
    this.shortDescription = data.shortDescription;
    this.detailedDescription = data.detailedDescription ?? undefined;
    this.manufacturer = data.manufacturer ?? undefined;
    this.isVisible = data.isVisible;
    this.displayOrder = data.displayOrder;
    this.categoryId = data.categoryId;
    this.partnerId = data.partnerId ?? undefined;
    this.imageMediaId = data.imageMediaId ?? undefined;
    this.category = new ProductCategoryResponse(data.category!);
    this.partner = data.partner ? new PartnerResponse(data.partner) : undefined;
    this.image = data.image ? new MediaResponse(data.image) : undefined;
  }
}
