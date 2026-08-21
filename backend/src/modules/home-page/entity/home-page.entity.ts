import { BaseEntity } from '@/common/base/base.entity';
import { HomePageZodType } from '@/modules/home-page/zod/home-page.zod';
import { MediaEntity } from '@/modules/media/entity/media.entity';

export class HomePageEntity extends BaseEntity {
  heroTitle!: string;
  heroDescription!: string;
  heroImageMediaId!: number | null;
  primaryCtaText!: string;
  primaryCtaUrl!: string;
  secondaryCtaText!: string;
  secondaryCtaUrl!: string;
  aboutPreviewTitle!: string;
  aboutPreviewDescription!: string;
  aboutPreviewImageMediaId!: number | null;
  aboutPreviewCtaText!: string;
  aboutPreviewCtaUrl!: string;
  partnersSectionTitle!: string;
  partnersSectionDescription!: string | null;
  productsSectionTitle!: string;
  productsSectionDescription!: string | null;
  servicesSectionTitle!: string;
  servicesSectionDescription!: string | null;
  whyTitle!: string;
  whyDescription!: string;
  whyEyebrow!: string;
  whyReason1Title!: string;
  whyReason1Description!: string;
  whyReason2Title!: string;
  whyReason2Description!: string;
  whyReason3Title!: string;
  whyReason3Description!: string;
  whyReason4Title!: string;
  whyReason4Description!: string;
  whyImageMediaId!: number | null;
  heroEyebrow!: string;
  aboutEyebrow!: string;
  aboutMetric1Value!: string;
  aboutMetric1Label!: string;
  aboutMetric2Value!: string;
  aboutMetric2Label!: string;
  aboutMetric3Value!: string;
  aboutMetric3Label!: string;
  contactSectionTitle!: string;
  contactSectionDescription!: string | null;
  heroImage?: MediaEntity;
  aboutPreviewImage?: MediaEntity;
  whyImage?: MediaEntity;

  constructor(data: HomePageZodType) {
    super();
    Object.assign(this, data);
  }
}
