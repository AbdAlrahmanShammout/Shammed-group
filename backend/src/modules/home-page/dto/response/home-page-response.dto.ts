import { ApiProperty } from '@nestjs/swagger';

import { HomePageResponse } from '@/modules/home-page/dto/response/model/home-page.response';
import { HomePageEntity } from '@/modules/home-page/entity/home-page.entity';

export class HomePageResponseDto {
  @ApiProperty({ type: () => HomePageResponse })
  homePage: HomePageResponse;

  constructor(entity: HomePageEntity) {
    this.homePage = new HomePageResponse(entity);
  }
}
