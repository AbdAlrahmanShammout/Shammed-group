import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AboutPageEntity } from '@/modules/about-page/entity/about-page.entity';
import { BaseModelResponseDto } from '@/common/base/base-model-response.dto';
import { MediaResponse } from '@/modules/media/dto/response/model/media.response';

export class AboutPageResponse extends BaseModelResponseDto {
  @ApiProperty({
    description: 'Free-form company overview',
    example:
      'Shammed Group was established in 2005 to distribute pharmaceutical and medical products.',
  })
  overview: string;

  @ApiPropertyOptional({ description: 'Overview image media identifier', example: 1 })
  overviewImageMediaId?: number;

  @ApiProperty({
    description: 'Free-form company vision',
    example: 'To be a trusted regional partner for international healthcare companies.',
  })
  vision: string;

  @ApiProperty({
    description: 'Free-form company mission',
    example: 'Provide reliable distribution, representation, and commercial support.',
  })
  mission: string;

  @ApiProperty({
    description: 'Free-form company values as a single text field',
    example: 'Quality, trust, professionalism, innovation, partnership, and commitment.',
  })
  values: string;

  @ApiProperty({
    description: 'Free-form company capabilities',
    example: 'Distribution, international representation, and a regional sales network.',
  })
  capabilities: string;

  @ApiPropertyOptional({ type: () => MediaResponse })
  overviewImage?: MediaResponse;

  constructor(data: AboutPageEntity) {
    super(data);
    this.overview = data.overview;
    this.overviewImageMediaId = data.overviewImageMediaId ?? undefined;
    this.vision = data.vision;
    this.mission = data.mission;
    this.values = data.values;
    this.capabilities = data.capabilities;
    this.overviewImage = data.overviewImage ? new MediaResponse(data.overviewImage) : undefined;
  }
}
