import { ApiProperty } from '@nestjs/swagger';

import { BaseModelResponseDto } from '@/common/base/base-model-response.dto';
import { SocialLinkEntity } from '@/modules/social-link/entity/social-link.entity';

export class SocialLinkResponse extends BaseModelResponseDto {
  @ApiProperty({ description: 'Platform display name', example: 'LinkedIn' })
  platform: string;

  @ApiProperty({ description: 'Profile URL', example: 'https://www.linkedin.com/company/example' })
  url: string;

  @ApiProperty({ description: 'Whether the link is public', example: true })
  isVisible: boolean;

  @ApiProperty({ description: 'Sort order among social links', example: 0 })
  displayOrder: number;

  constructor(data: SocialLinkEntity) {
    super(data);
    this.platform = data.platform;
    this.url = data.url;
    this.isVisible = data.isVisible;
    this.displayOrder = data.displayOrder;
  }
}
