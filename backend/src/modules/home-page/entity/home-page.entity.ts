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
  whyImageMediaId!: number | null;
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
