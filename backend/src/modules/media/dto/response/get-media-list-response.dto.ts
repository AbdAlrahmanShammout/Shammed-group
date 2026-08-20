import { ApiProperty } from '@nestjs/swagger';

import { MediaResponse } from '@/modules/media/dto/response/model/media.response';
import type { MediaEntity } from '@/modules/media/entity/media.entity';

export class GetMediaListResponseDto {
  @ApiProperty({ type: () => [MediaResponse] })
  mediaList: MediaResponse[];

  @ApiProperty({ description: 'Total media records in the database', example: 42 })
  total: number;

  constructor(entities: MediaEntity[], total: number) {
    this.mediaList = entities.map((entity) => new MediaResponse(entity));
    this.total = total;
  }
}
