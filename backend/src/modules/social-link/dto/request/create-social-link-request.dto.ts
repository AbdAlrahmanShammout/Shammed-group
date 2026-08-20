import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsInt, IsOptional, IsUrl, Min } from 'class-validator';

import { SOCIAL_PLATFORM_KEYS } from '@/modules/social-link/social-link.constants';

export class CreateSocialLinkRequestDto {
  @ApiProperty({
    description: 'Platform key',
    enum: SOCIAL_PLATFORM_KEYS,
    example: 'linkedin',
  })
  @IsIn(SOCIAL_PLATFORM_KEYS)
  platform!: string;

  @ApiProperty({ description: 'Profile URL', example: 'https://www.linkedin.com/company/example' })
  @IsUrl({ require_protocol: true })
  url!: string;

  @ApiPropertyOptional({ description: 'Whether the link is public', example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: 'Sort order among social links', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
