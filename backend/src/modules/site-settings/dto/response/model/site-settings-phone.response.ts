import { ApiProperty } from '@nestjs/swagger';

import { SiteSettingsPhoneEntity } from '@/modules/site-settings/entity/site-settings-phone.entity';

export class SiteSettingsPhoneResponse {
  @ApiProperty({ description: 'Phone record identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'Label shown above the phone number', example: 'Primary' })
  label: string;

  @ApiProperty({ description: 'Company phone number', example: '+963 11 000 0000' })
  phone: string;

  @ApiProperty({ description: 'Sort order among phones', example: 0 })
  displayOrder: number;

  constructor(data: SiteSettingsPhoneEntity) {
    this.id = data.id;
    this.label = data.label;
    this.phone = data.phone;
    this.displayOrder = data.displayOrder;
  }
}
