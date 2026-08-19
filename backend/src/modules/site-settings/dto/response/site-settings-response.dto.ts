import { ApiProperty } from '@nestjs/swagger';

import { SiteSettingsResponse } from '@/modules/site-settings/dto/response/model/site-settings.response';
import { SiteSettingsEntity } from '@/modules/site-settings/entity/site-settings.entity';

export class SiteSettingsResponseDto {
  @ApiProperty({ type: () => SiteSettingsResponse })
  siteSettings: SiteSettingsResponse;

  constructor(entity: SiteSettingsEntity) {
    this.siteSettings = new SiteSettingsResponse(entity);
  }
}
