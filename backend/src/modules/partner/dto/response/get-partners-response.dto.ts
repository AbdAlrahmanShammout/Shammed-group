import { ApiProperty } from '@nestjs/swagger';

import { PartnerPage } from '@/modules/partner/defs/partner-repository.defs';
import { PartnerResponse } from '@/modules/partner/dto/response/model/partner.response';

export class GetPartnersResponseDto {
  @ApiProperty({ type: () => [PartnerResponse] })
  partners: PartnerResponse[];

  @ApiProperty({ description: 'Total rows matching the filter, across all pages', example: 4 })
  total: number;

  constructor(page: PartnerPage) {
    this.partners = page.entities.map((entity) => new PartnerResponse(entity));
    this.total = page.total;
  }
}
