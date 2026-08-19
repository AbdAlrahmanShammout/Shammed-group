import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class UpdateSocialLinkRequestDto {
  @ApiPropertyOptional({ description: 'Platform display name', example: 'LinkedIn' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  platform?: string;

  @ApiPropertyOptional({
    description: 'Profile URL',
    example: 'https://www.linkedin.com/company/example',
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  url?: string;

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
