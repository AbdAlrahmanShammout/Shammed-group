import { ApiProperty } from '@nestjs/swagger';

import { SocialLinkResponse } from '@/modules/social-link/dto/response/model/social-link.response';
import { SocialLinkEntity } from '@/modules/social-link/entity/social-link.entity';

export class SocialLinkResponseDto {
  @ApiProperty({ type: () => SocialLinkResponse })
  socialLink: SocialLinkResponse;

  constructor(entity: SocialLinkEntity) {
    this.socialLink = new SocialLinkResponse(entity);
  }
}
