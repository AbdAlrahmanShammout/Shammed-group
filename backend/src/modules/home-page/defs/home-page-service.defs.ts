import { HomePageEntity } from '@/modules/home-page/entity/home-page.entity';
import { PartnerEntity } from '@/modules/partner/entity/partner.entity';
import { ProductEntity } from '@/modules/product/entity/product.entity';
import { ServiceEntity } from '@/modules/service/entity/service.entity';

export type CreateHomePageServiceInput = {
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
  readonly whyImageMediaId?: number;
  readonly contactSectionTitle: string;
  readonly contactSectionDescription?: string;
};

export type UpdateHomePageServiceInput = {
  readonly heroTitle?: string;
  readonly heroDescription?: string;
  readonly heroImageMediaId?: number | null;
  readonly primaryCtaText?: string;
  readonly primaryCtaUrl?: string;
  readonly secondaryCtaText?: string;
  readonly secondaryCtaUrl?: string;
  readonly aboutPreviewTitle?: string;
  readonly aboutPreviewDescription?: string;
  readonly aboutPreviewImageMediaId?: number | null;
  readonly aboutPreviewCtaText?: string;
  readonly aboutPreviewCtaUrl?: string;
  readonly partnersSectionTitle?: string;
  readonly partnersSectionDescription?: string | null;
  readonly productsSectionTitle?: string;
  readonly productsSectionDescription?: string | null;
  readonly servicesSectionTitle?: string;
  readonly servicesSectionDescription?: string | null;
  readonly whyTitle?: string;
  readonly whyDescription?: string;
  readonly whyImageMediaId?: number | null;
  readonly contactSectionTitle?: string;
  readonly contactSectionDescription?: string | null;
};

export type PublicHomePageReadModel = {
  readonly homePage: HomePageEntity;
  readonly partners: PartnerEntity[];
  readonly products: ProductEntity[];
  readonly services: ServiceEntity[];
};
