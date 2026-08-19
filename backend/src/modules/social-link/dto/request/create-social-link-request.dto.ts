import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateSocialLinkRequestDto {
  @ApiProperty({ description: 'Platform display name', example: 'LinkedIn' })
  @IsString()
  @IsNotEmpty()
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
