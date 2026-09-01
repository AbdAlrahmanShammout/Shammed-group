import { ApiProperty } from '@nestjs/swagger';

import { SiteSettingsEmailEntity } from '@/modules/site-settings/entity/site-settings-email.entity';

export class SiteSettingsEmailResponse {
  @ApiProperty({ description: 'Email record identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'Label shown above the email address', example: 'Primary' })
  label: string;

  @ApiProperty({ description: 'Company email address', example: 'info@shammed-group.com' })
  email: string;

  @ApiProperty({ description: 'Sort order among emails', example: 0 })
  displayOrder: number;

  constructor(data: SiteSettingsEmailEntity) {
    this.id = data.id;
    this.label = data.label;
    this.email = data.email;
    this.displayOrder = data.displayOrder;
  }
}
