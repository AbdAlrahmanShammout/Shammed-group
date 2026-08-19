import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseModelResponseDto } from '@/common/base/base-model-response.dto';
import { HomePageEntity } from '@/modules/home-page/entity/home-page.entity';
import { MediaResponse } from '@/modules/media/dto/response/model/media.response';

export class HomePageResponse extends BaseModelResponseDto {
  @ApiProperty({ description: 'Hero heading', example: 'Shammed Group' })
  heroTitle: string;

  @ApiProperty({
    description: 'Hero short description',
    example: 'Pharmaceutical and medical product distribution since 2005.',
  })
  heroDescription: string;

  @ApiPropertyOptional({ description: 'Hero image media identifier', example: 1 })
  heroImageMediaId?: number;

  @ApiProperty({ description: 'Primary call-to-action label', example: 'Learn More' })
  primaryCtaText: string;

  @ApiProperty({ description: 'Primary call-to-action destination', example: '/about' })
  primaryCtaUrl: string;

  @ApiProperty({ description: 'Secondary call-to-action label', example: 'Contact Us' })
  secondaryCtaText: string;

  @ApiProperty({ description: 'Secondary call-to-action destination', example: '/contact' })
  secondaryCtaUrl: string;

  @ApiProperty({ description: 'About preview heading', example: 'About Us' })
  aboutPreviewTitle: string;

  @ApiProperty({
    description: 'About preview description',
    example: 'Founded in 2005, Shammed Group represents international healthcare companies.',
  })
  aboutPreviewDescription: string;

  @ApiPropertyOptional({ description: 'About preview image media identifier', example: 2 })
  aboutPreviewImageMediaId?: number;

  @ApiProperty({ description: 'About preview call-to-action label', example: 'Read more' })
  aboutPreviewCtaText: string;

  @ApiProperty({ description: 'About preview call-to-action destination', example: '/about' })
  aboutPreviewCtaUrl: string;

  @ApiProperty({ description: 'Partners section heading', example: 'Our Partners' })
  partnersSectionTitle: string;

  @ApiPropertyOptional({
    description: 'Partners section description',
    example: 'International manufacturers represented in the region.',
  })
  partnersSectionDescription?: string;

  @ApiProperty({ description: 'Products section heading', example: 'Our Products' })
  productsSectionTitle: string;

  @ApiPropertyOptional({
    description: 'Products section description',
    example: 'A representative selection of healthcare products.',
  })
  productsSectionDescription?: string;

  @ApiProperty({ description: 'Services section heading', example: 'Our Services' })
  servicesSectionTitle: string;

  @ApiPropertyOptional({
    description: 'Services section description',
    example: 'Distribution, representation, and commercial support.',
  })
  servicesSectionDescription?: string;

  @ApiProperty({ description: 'Why section heading', example: 'Why Shammed Group' })
  whyTitle: string;

  @ApiProperty({
    description: 'Why section description',
    example: 'Experience, international partnerships, and a regional distribution network.',
  })
  whyDescription: string;

  @ApiPropertyOptional({ description: 'Why section image media identifier', example: 3 })
  whyImageMediaId?: number;

  @ApiProperty({ description: 'Contact section heading', example: 'Contact Us' })
  contactSectionTitle: string;

  @ApiPropertyOptional({
    description: 'Contact section description',
    example: 'Reach our offices for partnership and distribution inquiries.',
  })
  contactSectionDescription?: string;

  @ApiPropertyOptional({ type: () => MediaResponse })
  heroImage?: MediaResponse;

  @ApiPropertyOptional({ type: () => MediaResponse })
  aboutPreviewImage?: MediaResponse;

  @ApiPropertyOptional({ type: () => MediaResponse })
  whyImage?: MediaResponse;

  constructor(data: HomePageEntity) {
    super(data);
    this.heroTitle = data.heroTitle;
    this.heroDescription = data.heroDescription;
    this.heroImageMediaId = data.heroImageMediaId ?? undefined;
    this.primaryCtaText = data.primaryCtaText;
    this.primaryCtaUrl = data.primaryCtaUrl;
    this.secondaryCtaText = data.secondaryCtaText;
    this.secondaryCtaUrl = data.secondaryCtaUrl;
    this.aboutPreviewTitle = data.aboutPreviewTitle;
    this.aboutPreviewDescription = data.aboutPreviewDescription;
    this.aboutPreviewImageMediaId = data.aboutPreviewImageMediaId ?? undefined;
    this.aboutPreviewCtaText = data.aboutPreviewCtaText;
    this.aboutPreviewCtaUrl = data.aboutPreviewCtaUrl;
    this.partnersSectionTitle = data.partnersSectionTitle;
    this.partnersSectionDescription = data.partnersSectionDescription ?? undefined;
    this.productsSectionTitle = data.productsSectionTitle;
    this.productsSectionDescription = data.productsSectionDescription ?? undefined;
    this.servicesSectionTitle = data.servicesSectionTitle;
    this.servicesSectionDescription = data.servicesSectionDescription ?? undefined;
    this.whyTitle = data.whyTitle;
    this.whyDescription = data.whyDescription;
    this.whyImageMediaId = data.whyImageMediaId ?? undefined;
    this.contactSectionTitle = data.contactSectionTitle;
    this.contactSectionDescription = data.contactSectionDescription ?? undefined;
    this.heroImage = data.heroImage ? new MediaResponse(data.heroImage) : undefined;
    this.aboutPreviewImage = data.aboutPreviewImage
      ? new MediaResponse(data.aboutPreviewImage)
      : undefined;
    this.whyImage = data.whyImage ? new MediaResponse(data.whyImage) : undefined;
  }
}
