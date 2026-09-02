import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateIf } from 'class-validator';

export class UpdateHomePageRequestDto {
  @ApiPropertyOptional({ description: 'Hero heading', example: 'Shammed Group' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  heroTitle?: string;

  @ApiPropertyOptional({
    description: 'Hero short description',
    example: 'Pharmaceutical and medical product distribution since 2005.',
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  heroDescription?: string;

  @ApiPropertyOptional({ description: 'Hero image media identifier', example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  heroImageMediaId?: number | null;

  @ApiPropertyOptional({ description: 'Primary call-to-action label', example: 'Learn More' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  primaryCtaText?: string;

  @ApiPropertyOptional({ description: 'Primary call-to-action destination', example: '/about' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  primaryCtaUrl?: string;

  @ApiPropertyOptional({ description: 'Secondary call-to-action label', example: 'Contact Us' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  secondaryCtaText?: string;

  @ApiPropertyOptional({ description: 'Secondary call-to-action destination', example: '/contact' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  secondaryCtaUrl?: string;

  @ApiPropertyOptional({ description: 'About preview heading', example: 'About Us' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  aboutPreviewTitle?: string;

  @ApiPropertyOptional({
    description: 'About preview description',
    example: 'Founded in 2005, Shammed Group represents international healthcare companies.',
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  aboutPreviewDescription?: string;

  @ApiPropertyOptional({
    description: 'About preview image media identifier',
    example: 2,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  aboutPreviewImageMediaId?: number | null;

  @ApiPropertyOptional({ description: 'About preview call-to-action label', example: 'Read more' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  aboutPreviewCtaText?: string;

  @ApiPropertyOptional({
    description: 'About preview call-to-action destination',
    example: '/about',
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  aboutPreviewCtaUrl?: string;

  @ApiPropertyOptional({ description: 'Partners section heading', example: 'Our Partners' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  partnersSectionTitle?: string;

  @ApiPropertyOptional({
    description: 'Partners section description',
    example: 'International manufacturers represented in the region.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  partnersSectionDescription?: string | null;

  @ApiPropertyOptional({ description: 'Products section heading', example: 'Our Products' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  productsSectionTitle?: string;

  @ApiPropertyOptional({
    description: 'Products section description',
    example: 'A representative selection of healthcare products.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productsSectionDescription?: string | null;

  @ApiPropertyOptional({ description: 'Services section heading', example: 'Our Services' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  servicesSectionTitle?: string;

  @ApiPropertyOptional({
    description: 'Services section description',
    example: 'Distribution, representation, and commercial support.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  servicesSectionDescription?: string | null;

  @ApiPropertyOptional({ description: 'Why section heading', example: 'Why Shammed Group' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  whyTitle?: string;

  @ApiPropertyOptional({
    description: 'Why section description',
    example: 'Experience, international partnerships, and a regional distribution network.',
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  whyDescription?: string;

  @ApiPropertyOptional({ description: 'Why section eyebrow label', example: 'Our identity' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  whyEyebrow?: string;

  @ApiPropertyOptional({ description: 'Why reason 1 title', example: 'Quality-Certified Portfolio' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  whyReason1Title?: string;

  @ApiPropertyOptional({ description: 'Why reason 1 description' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  whyReason1Description?: string;

  @ApiPropertyOptional({ description: 'Why reason 2 title' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  whyReason2Title?: string;

  @ApiPropertyOptional({ description: 'Why reason 2 description' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  whyReason2Description?: string;

  @ApiPropertyOptional({ description: 'Why reason 3 title' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  whyReason3Title?: string;

  @ApiPropertyOptional({ description: 'Why reason 3 description' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  whyReason3Description?: string;

  @ApiPropertyOptional({ description: 'Why reason 4 title' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  whyReason4Title?: string;

  @ApiPropertyOptional({ description: 'Why reason 4 description' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  whyReason4Description?: string;

  @ApiPropertyOptional({
    description: 'Why section image media identifier',
    example: 3,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  whyImageMediaId?: number | null;

  @ApiPropertyOptional({ description: 'Hero eyebrow label', example: 'FORMULATION / 01 — SYRIA' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  heroEyebrow?: string;

  @ApiPropertyOptional({
    description: 'Hero experience annotation shown on the visual',
    example: '+20 years of advancing healthcare in Syria',
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  heroExperienceLabel?: string;

  @ApiPropertyOptional({ description: 'About section eyebrow label', example: 'About us' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  aboutEyebrow?: string;

  @ApiPropertyOptional({ description: 'About metric 1 value', example: '40+' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  aboutMetric1Value?: string;

  @ApiPropertyOptional({ description: 'About metric 1 label', example: 'Years in healthcare' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  aboutMetric1Label?: string;

  @ApiPropertyOptional({ description: 'About metric 2 value', example: '300+' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  aboutMetric2Value?: string;

  @ApiPropertyOptional({ description: 'About metric 2 label', example: 'Products & equipment' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  aboutMetric2Label?: string;

  @ApiPropertyOptional({ description: 'About metric 3 value', example: '100%' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  aboutMetric3Value?: string;

  @ApiPropertyOptional({ description: 'About metric 3 label', example: 'Syria coverage' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  aboutMetric3Label?: string;

  @ApiPropertyOptional({ description: 'Contact section heading', example: 'Contact Us' })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  contactSectionTitle?: string;

  @ApiPropertyOptional({
    description: 'Contact section description',
    example: 'Reach our offices for partnership and distribution inquiries.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  contactSectionDescription?: string | null;
}
