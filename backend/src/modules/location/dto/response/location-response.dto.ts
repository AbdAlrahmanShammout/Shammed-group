import { ApiProperty } from '@nestjs/swagger';

import { LocationResponse } from '@/modules/location/dto/response/model/location.response';
import { LocationEntity } from '@/modules/location/entity/location.entity';

export class LocationResponseDto {
  @ApiProperty({ type: () => LocationResponse })
  location: LocationResponse;

  constructor(entity: LocationEntity) {
    this.location = new LocationResponse(entity);
  }
}
