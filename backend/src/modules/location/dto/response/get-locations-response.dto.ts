import { ApiProperty } from '@nestjs/swagger';

import { LocationPage } from '@/modules/location/defs/location-repository.defs';
import { LocationResponse } from '@/modules/location/dto/response/model/location.response';

export class GetLocationsResponseDto {
  @ApiProperty({ type: () => [LocationResponse] })
  locations: LocationResponse[];

  @ApiProperty({ description: 'Total rows matching the filter, across all pages', example: 3 })
  total: number;

  constructor(page: LocationPage) {
    this.locations = page.entities.map((entity) => new LocationResponse(entity));
    this.total = page.total;
  }
}
