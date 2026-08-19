import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseModelResponseDto } from '@/common/base/base-model-response.dto';
import { MediaResponse } from '@/modules/media/dto/response/model/media.response';
import { PartnerEntity } from '@/modules/partner/entity/partner.entity';

export class PartnerResponse extends BaseModelResponseDto {
  @ApiProperty({ description: 'Partner company name', example: 'Example Pharma' })
  name: string;

  @ApiProperty({
    description: 'Short public description',
    example: 'International pharmaceutical manufacturer',
  })
  shortDescription: string;

  @ApiPropertyOptional({
    description: 'Full public description',
    example: 'Authorized representation for hospital-grade pharmaceuticals.',
  })
  fullDescription?: string;

  @ApiPropertyOptional({ description: 'Partner specialization', example: 'Oncology' })
  specialization?: string;

  @ApiPropertyOptional({
    description: 'Official website',
    example: 'https://www.example-pharma.com',
  })
  websiteUrl?: string;

  @ApiPropertyOptional({ description: 'Partner country', example: 'Germany' })
  country?: string;

  @ApiProperty({ description: 'Whether the partner is public', example: true })
  isVisible: boolean;

  @ApiProperty({ description: 'Sort order among partners', example: 0 })
  displayOrder: number;

  @ApiPropertyOptional({ description: 'Logo media identifier', example: 1 })
  logoMediaId?: number;

  @ApiPropertyOptional({ type: () => MediaResponse })
  logo?: MediaResponse;

  constructor(data: PartnerEntity) {
    super(data);
    this.name = data.name;
    this.shortDescription = data.shortDescription;
    this.fullDescription = data.fullDescription ?? undefined;
    this.specialization = data.specialization ?? undefined;
    this.websiteUrl = data.websiteUrl ?? undefined;
    this.country = data.country ?? undefined;
    this.isVisible = data.isVisible;
    this.displayOrder = data.displayOrder;
    this.logoMediaId = data.logoMediaId ?? undefined;
    this.logo = data.logo ? new MediaResponse(data.logo) : undefined;
  }
}
