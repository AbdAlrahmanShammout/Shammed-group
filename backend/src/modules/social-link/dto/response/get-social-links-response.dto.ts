import { ApiProperty } from '@nestjs/swagger';

import { SocialLinkPage } from '@/modules/social-link/defs/social-link-repository.defs';
import { SocialLinkResponse } from '@/modules/social-link/dto/response/model/social-link.response';

export class GetSocialLinksResponseDto {
  @ApiProperty({ type: () => [SocialLinkResponse] })
  socialLinks: SocialLinkResponse[];

  @ApiProperty({ description: 'Total rows matching the filter, across all pages', example: 4 })
  total: number;

  constructor(page: SocialLinkPage) {
    this.socialLinks = page.entities.map((entity) => new SocialLinkResponse(entity));
    this.total = page.total;
  }
}
