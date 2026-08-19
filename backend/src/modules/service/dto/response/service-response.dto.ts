import { ApiProperty } from '@nestjs/swagger';

import { ServiceResponse } from '@/modules/service/dto/response/model/service.response';
import { ServiceEntity } from '@/modules/service/entity/service.entity';

export class ServiceResponseDto {
  @ApiProperty({ type: () => ServiceResponse })
  service: ServiceResponse;

  constructor(entity: ServiceEntity) {
    this.service = new ServiceResponse(entity);
  }
}
