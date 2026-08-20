import { ApiProperty } from '@nestjs/swagger';

import { AboutPageResponse } from '@/modules/about-page/dto/response/model/about-page.response';
import { AboutPageEntity } from '@/modules/about-page/entity/about-page.entity';

export class AboutPageResponseDto {
  @ApiProperty({ type: () => AboutPageResponse })
  aboutPage: AboutPageResponse;

  constructor(entity: AboutPageEntity) {
    this.aboutPage = new AboutPageResponse(entity);
  }
}
