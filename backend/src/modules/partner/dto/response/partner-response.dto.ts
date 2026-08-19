import { ApiProperty } from '@nestjs/swagger';

import { PartnerResponse } from '@/modules/partner/dto/response/model/partner.response';
import { PartnerEntity } from '@/modules/partner/entity/partner.entity';

export class PartnerResponseDto {
  @ApiProperty({ type: () => PartnerResponse })
  partner: PartnerResponse;

  constructor(entity: PartnerEntity) {
    this.partner = new PartnerResponse(entity);
  }
}
