import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseModelResponseDto } from '@/common/base/base-model-response.dto';
import { MediaResponse } from '@/modules/media/dto/response/model/media.response';
import { ServiceEntity } from '@/modules/service/entity/service.entity';

export class ServiceResponse extends BaseModelResponseDto {
  @ApiProperty({
    description: 'Public service title',
    example: 'Pharmaceutical Product Distribution',
  })
  title: string;

  @ApiProperty({
    description: 'Public service description',
    example: 'Distribution of licensed pharmaceutical products across regional markets.',
  })
  description: string;

  @ApiProperty({ description: 'Whether the service is public', example: true })
  isVisible: boolean;

  @ApiProperty({ description: 'Sort order among services', example: 0 })
  displayOrder: number;

  @ApiPropertyOptional({ description: 'Primary image media identifier', example: 1 })
  imageMediaId?: number;

  @ApiPropertyOptional({ type: () => MediaResponse })
  image?: MediaResponse;

  constructor(data: ServiceEntity) {
    super(data);
    this.title = data.title;
    this.description = data.description;
    this.isVisible = data.isVisible;
    this.displayOrder = data.displayOrder;
    this.imageMediaId = data.imageMediaId ?? undefined;
    this.image = data.image ? new MediaResponse(data.image) : undefined;
  }
}
