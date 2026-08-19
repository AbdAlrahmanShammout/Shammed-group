import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreatePartnerRequestDto {
  @ApiProperty({ description: 'Partner company name', example: 'Example Pharma' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Short public description',
    example: 'International pharmaceutical manufacturer',
  })
  @IsString()
  @IsNotEmpty()
  shortDescription!: string;

  @ApiPropertyOptional({
    description: 'Full public description',
    example: 'Authorized representation for hospital-grade pharmaceuticals.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullDescription?: string;

  @ApiPropertyOptional({ description: 'Partner specialization', example: 'Oncology' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  specialization?: string;

  @ApiPropertyOptional({
    description: 'Official website',
    example: 'https://www.example-pharma.com',
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  websiteUrl?: string;

  @ApiPropertyOptional({ description: 'Partner country', example: 'Germany' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  country?: string;

  @ApiPropertyOptional({ description: 'Whether the partner is public', example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: 'Sort order among partners', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Logo media identifier', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  logoMediaId?: number;
}
