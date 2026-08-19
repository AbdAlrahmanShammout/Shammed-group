import { ApiProperty } from '@nestjs/swagger';

import { MediaResponse } from '@/modules/media/dto/response/model/media.response';
import { MediaEntity } from '@/modules/media/entity/media.entity';

export class CreateMediaResponseDto {
  @ApiProperty({ type: () => MediaResponse })
  media: MediaResponse;

  constructor(entity: MediaEntity) {
    this.media = new MediaResponse(entity);
  }
}
