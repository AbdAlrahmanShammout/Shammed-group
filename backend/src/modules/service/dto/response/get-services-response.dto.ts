import { ApiProperty } from '@nestjs/swagger';

import { ServicePage } from '@/modules/service/defs/service-repository.defs';
import { ServiceResponse } from '@/modules/service/dto/response/model/service.response';

export class GetServicesResponseDto {
  @ApiProperty({ type: () => [ServiceResponse] })
  services: ServiceResponse[];

  @ApiProperty({ description: 'Total rows matching the filter, across all pages', example: 4 })
  total: number;

  constructor(page: ServicePage) {
    this.services = page.entities.map((entity) => new ServiceResponse(entity));
    this.total = page.total;
  }
}
