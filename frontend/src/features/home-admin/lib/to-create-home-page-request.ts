import { toOptionalMediaId } from '@/features/home-admin/lib/to-optional-media-id';
import type { HomePageFormValues } from '@/features/home-admin/schemas/home-page-form.schema';
import type { CreateHomePageRequestDto } from '@/generated/admin-home.contract';

function toOptionalDescription(value: string): string | undefined {
  return value === '' ? undefined : value;
}

export function toCreateHomePageRequest(values: HomePageFormValues): CreateHomePageRequestDto {
  const heroImageMediaId = toOptionalMediaId(values.heroImageMediaId);
  const aboutPreviewImageMediaId = toOptionalMediaId(values.aboutPreviewImageMediaId);
  const whyImageMediaId = toOptionalMediaId(values.whyImageMediaId);
  return {
    heroTitle: values.heroTitle,
    heroDescription: values.heroDescription,
    heroImageMediaId: heroImageMediaId ?? undefined,
    primaryCtaText: values.primaryCtaText,
    primaryCtaUrl: values.primaryCtaUrl,
    secondaryCtaText: values.secondaryCtaText,
    secondaryCtaUrl: values.secondaryCtaUrl,
    aboutPreviewTitle: values.aboutPreviewTitle,
    aboutPreviewDescription: values.aboutPreviewDescription,
    aboutPreviewImageMediaId: aboutPreviewImageMediaId ?? undefined,
    aboutPreviewCtaText: values.aboutPreviewCtaText,
    aboutPreviewCtaUrl: values.aboutPreviewCtaUrl,
    partnersSectionTitle: values.partnersSectionTitle,
    partnersSectionDescription: toOptionalDescription(values.partnersSectionDescription),
    productsSectionTitle: values.productsSectionTitle,
    productsSectionDescription: toOptionalDescription(values.productsSectionDescription),
    servicesSectionTitle: values.servicesSectionTitle,
    servicesSectionDescription: toOptionalDescription(values.servicesSectionDescription),
    whyTitle: values.whyTitle,
    whyDescription: values.whyDescription,
    whyImageMediaId: whyImageMediaId ?? undefined,
    contactSectionTitle: values.contactSectionTitle,
    contactSectionDescription: toOptionalDescription(values.contactSectionDescription),
  };
}
