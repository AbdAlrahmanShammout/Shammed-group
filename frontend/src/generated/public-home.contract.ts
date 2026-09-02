/**
 * Wire types for GET /home-page.
 * Keep aligned with the public Home OpenAPI document.
 * Do not import backend source types.
 */
import type { MediaResponse } from '@/generated/public-site.contract';

export type HomePageResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly heroTitle: string;
  readonly heroDescription: string;
  readonly heroImageMediaId?: number;
  readonly primaryCtaText: string;
  readonly primaryCtaUrl: string;
  readonly secondaryCtaText: string;
  readonly secondaryCtaUrl: string;
  readonly aboutPreviewTitle: string;
  readonly aboutPreviewDescription: string;
  readonly aboutPreviewImageMediaId?: number;
  readonly aboutPreviewCtaText: string;
  readonly aboutPreviewCtaUrl: string;
  readonly partnersSectionTitle: string;
  readonly partnersSectionDescription?: string;
  readonly productsSectionTitle: string;
  readonly productsSectionDescription?: string;
  readonly servicesSectionTitle: string;
  readonly servicesSectionDescription?: string;
  readonly whyTitle: string;
  readonly whyDescription: string;
  readonly whyEyebrow: string;
  readonly whyReason1Title: string;
  readonly whyReason1Description: string;
  readonly whyReason2Title: string;
  readonly whyReason2Description: string;
  readonly whyReason3Title: string;
  readonly whyReason3Description: string;
  readonly whyReason4Title: string;
  readonly whyReason4Description: string;
  readonly whyImageMediaId?: number;
  readonly heroEyebrow: string;
  readonly heroExperienceLabel: string;
  readonly aboutEyebrow: string;
  readonly aboutMetric1Value: string;
  readonly aboutMetric1Label: string;
  readonly aboutMetric2Value: string;
  readonly aboutMetric2Label: string;
  readonly aboutMetric3Value: string;
  readonly aboutMetric3Label: string;
  readonly contactSectionTitle: string;
  readonly contactSectionDescription?: string;
  readonly heroImage?: MediaResponse;
  readonly aboutPreviewImage?: MediaResponse;
  readonly whyImage?: MediaResponse;
};

export type PublicPartnerResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly name: string;
  readonly shortDescription: string;
  readonly fullDescription?: string;
  readonly specialization?: string;
  readonly websiteUrl?: string;
  readonly country?: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
  readonly logoMediaId?: number;
  readonly logo?: MediaResponse;
};

export type PublicProductCategoryResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly name: string;
  readonly description?: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
  readonly color?: string;
};

export type PublicProductResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly name: string;
  readonly shortDescription: string;
  readonly detailedDescription?: string;
  readonly manufacturer?: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
  readonly categoryId: number;
  readonly partnerId?: number;
  readonly imageMediaId?: number;
  readonly category: PublicProductCategoryResponse;
  readonly partner?: PublicPartnerResponse;
  readonly image?: MediaResponse;
};

export type PublicServiceResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly title: string;
  readonly description: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
  readonly imageMediaId?: number;
  readonly image?: MediaResponse;
};

export type GetPublicHomePageResponseDto = {
  readonly homePage: HomePageResponse;
  readonly partners: readonly PublicPartnerResponse[];
  readonly products: readonly PublicProductResponse[];
  readonly services: readonly PublicServiceResponse[];
};
