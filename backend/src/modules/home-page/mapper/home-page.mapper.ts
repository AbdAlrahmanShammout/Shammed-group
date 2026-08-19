import { HomePageEntity } from '@/modules/home-page/entity/home-page.entity';
import type { HomePageType } from '@/modules/home-page/types/home-page-details-schema.type';
import { MediaMapper } from '@/modules/media/mapper/media.mapper';

export class HomePageMapper {
  static toEntity(schema: HomePageType): HomePageEntity {
    return new HomePageEntity({
      id: schema.id,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      heroTitle: schema.heroTitle,
      heroDescription: schema.heroDescription,
      heroImageMediaId: schema.heroImageMediaId ?? null,
      primaryCtaText: schema.primaryCtaText,
      primaryCtaUrl: schema.primaryCtaUrl,
      secondaryCtaText: schema.secondaryCtaText,
      secondaryCtaUrl: schema.secondaryCtaUrl,
      aboutPreviewTitle: schema.aboutPreviewTitle,
      aboutPreviewDescription: schema.aboutPreviewDescription,
      aboutPreviewImageMediaId: schema.aboutPreviewImageMediaId ?? null,
      aboutPreviewCtaText: schema.aboutPreviewCtaText,
      aboutPreviewCtaUrl: schema.aboutPreviewCtaUrl,
      partnersSectionTitle: schema.partnersSectionTitle,
      partnersSectionDescription: schema.partnersSectionDescription ?? null,
      productsSectionTitle: schema.productsSectionTitle,
      productsSectionDescription: schema.productsSectionDescription ?? null,
      servicesSectionTitle: schema.servicesSectionTitle,
      servicesSectionDescription: schema.servicesSectionDescription ?? null,
      whyTitle: schema.whyTitle,
      whyDescription: schema.whyDescription,
      whyImageMediaId: schema.whyImageMediaId ?? null,
      contactSectionTitle: schema.contactSectionTitle,
      contactSectionDescription: schema.contactSectionDescription ?? null,
      heroImage: schema.heroImage ? MediaMapper.toEntity(schema.heroImage) : undefined,
      aboutPreviewImage: schema.aboutPreviewImage
        ? MediaMapper.toEntity(schema.aboutPreviewImage)
        : undefined,
      whyImage: schema.whyImage ? MediaMapper.toEntity(schema.whyImage) : undefined,
    });
  }
}
