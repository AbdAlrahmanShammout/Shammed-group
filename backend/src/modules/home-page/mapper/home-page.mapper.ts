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
      whyEyebrow: schema.whyEyebrow,
      whyReason1Title: schema.whyReason1Title,
      whyReason1Description: schema.whyReason1Description,
      whyReason2Title: schema.whyReason2Title,
      whyReason2Description: schema.whyReason2Description,
      whyReason3Title: schema.whyReason3Title,
      whyReason3Description: schema.whyReason3Description,
      whyReason4Title: schema.whyReason4Title,
      whyReason4Description: schema.whyReason4Description,
      whyImageMediaId: schema.whyImageMediaId ?? null,
      heroEyebrow: schema.heroEyebrow,
      aboutEyebrow: schema.aboutEyebrow,
      aboutMetric1Value: schema.aboutMetric1Value,
      aboutMetric1Label: schema.aboutMetric1Label,
      aboutMetric2Value: schema.aboutMetric2Value,
      aboutMetric2Label: schema.aboutMetric2Label,
      aboutMetric3Value: schema.aboutMetric3Value,
      aboutMetric3Label: schema.aboutMetric3Label,
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
