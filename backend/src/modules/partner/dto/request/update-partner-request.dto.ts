import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class UpdatePartnerRequestDto {
  @ApiPropertyOptional({ description: 'Partner company name', example: 'Example Pharma' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: 'Short public description',
    example: 'International pharmaceutical manufacturer',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  shortDescription?: string;

  @ApiPropertyOptional({
    description: 'Full public description',
    example: 'Authorized representation for hospital-grade pharmaceuticals.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullDescription?: string | null;

  @ApiPropertyOptional({
    description: 'Partner specialization',
    example: 'Oncology',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  specialization?: string | null;

  @ApiPropertyOptional({
    description: 'Official website',
    example: 'https://www.example-pharma.com',
    nullable: true,
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  websiteUrl?: string | null;

  @ApiPropertyOptional({ description: 'Partner country', example: 'Germany', nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  country?: string | null;

  @ApiPropertyOptional({ description: 'Whether the partner is public', example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: 'Sort order among partners', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Logo media identifier', example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  logoMediaId?: number | null;
}
