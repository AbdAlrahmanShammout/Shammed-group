import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateHomePageRequestDto {
  @ApiProperty({ description: 'Hero heading', example: 'Shammed Group' })
  @IsString()
  @IsNotEmpty()
  heroTitle!: string;

  @ApiProperty({
    description: 'Hero short description',
    example: 'Pharmaceutical and medical product distribution since 2005.',
  })
  @IsString()
  @IsNotEmpty()
  heroDescription!: string;

  @ApiPropertyOptional({ description: 'Hero image media identifier', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  heroImageMediaId?: number;

  @ApiProperty({ description: 'Primary call-to-action label', example: 'Learn More' })
  @IsString()
  @IsNotEmpty()
  primaryCtaText!: string;

  @ApiProperty({ description: 'Primary call-to-action destination', example: '/about' })
  @IsString()
  @IsNotEmpty()
  primaryCtaUrl!: string;

  @ApiProperty({ description: 'Secondary call-to-action label', example: 'Contact Us' })
  @IsString()
  @IsNotEmpty()
  secondaryCtaText!: string;

  @ApiProperty({ description: 'Secondary call-to-action destination', example: '/contact' })
  @IsString()
  @IsNotEmpty()
  secondaryCtaUrl!: string;

  @ApiProperty({ description: 'About preview heading', example: 'About Us' })
  @IsString()
  @IsNotEmpty()
  aboutPreviewTitle!: string;

  @ApiProperty({
    description: 'About preview description',
    example: 'Founded in 2005, Shammed Group represents international healthcare companies.',
  })
  @IsString()
  @IsNotEmpty()
  aboutPreviewDescription!: string;

  @ApiPropertyOptional({ description: 'About preview image media identifier', example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  aboutPreviewImageMediaId?: number;

  @ApiProperty({ description: 'About preview call-to-action label', example: 'Read more' })
  @IsString()
  @IsNotEmpty()
  aboutPreviewCtaText!: string;

  @ApiProperty({ description: 'About preview call-to-action destination', example: '/about' })
  @IsString()
  @IsNotEmpty()
  aboutPreviewCtaUrl!: string;

  @ApiProperty({ description: 'Partners section heading', example: 'Our Partners' })
  @IsString()
  @IsNotEmpty()
  partnersSectionTitle!: string;

  @ApiPropertyOptional({
    description: 'Partners section description',
    example: 'International manufacturers represented in the region.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  partnersSectionDescription?: string;

  @ApiProperty({ description: 'Products section heading', example: 'Our Products' })
  @IsString()
  @IsNotEmpty()
  productsSectionTitle!: string;

  @ApiPropertyOptional({
    description: 'Products section description',
    example: 'A representative selection of healthcare products.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productsSectionDescription?: string;

  @ApiProperty({ description: 'Services section heading', example: 'Our Services' })
  @IsString()
  @IsNotEmpty()
  servicesSectionTitle!: string;

  @ApiPropertyOptional({
    description: 'Services section description',
    example: 'Distribution, representation, and commercial support.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  servicesSectionDescription?: string;

  @ApiProperty({ description: 'Why section heading', example: 'Why Shammed Group' })
  @IsString()
  @IsNotEmpty()
  whyTitle!: string;

  @ApiProperty({
    description: 'Why section description',
    example: 'Experience, international partnerships, and a regional distribution network.',
  })
  @IsString()
  @IsNotEmpty()
  whyDescription!: string;

  @ApiPropertyOptional({ description: 'Why section image media identifier', example: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  whyImageMediaId?: number;

  @ApiProperty({ description: 'Contact section heading', example: 'Contact Us' })
  @IsString()
  @IsNotEmpty()
  contactSectionTitle!: string;

  @ApiPropertyOptional({
    description: 'Contact section description',
    example: 'Reach our offices for partnership and distribution inquiries.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  contactSectionDescription?: string;
}
