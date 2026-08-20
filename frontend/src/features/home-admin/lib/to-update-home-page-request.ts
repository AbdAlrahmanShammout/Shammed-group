import { toOptionalMediaId } from '@/features/home-admin/lib/to-optional-media-id';
import type { HomePageFormValues } from '@/features/home-admin/schemas/home-page-form.schema';
import type { UpdateHomePageRequestDto } from '@/generated/admin-home.contract';

function toNullableDescription(value: string): string | null {
  return value === '' ? null : value;
}

export function toUpdateHomePageRequest(values: HomePageFormValues): UpdateHomePageRequestDto {
  return {
    heroTitle: values.heroTitle,
    heroDescription: values.heroDescription,
    heroImageMediaId: toOptionalMediaId(values.heroImageMediaId),
    primaryCtaText: values.primaryCtaText,
    primaryCtaUrl: values.primaryCtaUrl,
    secondaryCtaText: values.secondaryCtaText,
    secondaryCtaUrl: values.secondaryCtaUrl,
    aboutPreviewTitle: values.aboutPreviewTitle,
    aboutPreviewDescription: values.aboutPreviewDescription,
    aboutPreviewImageMediaId: toOptionalMediaId(values.aboutPreviewImageMediaId),
    aboutPreviewCtaText: values.aboutPreviewCtaText,
    aboutPreviewCtaUrl: values.aboutPreviewCtaUrl,
    partnersSectionTitle: values.partnersSectionTitle,
    partnersSectionDescription: toNullableDescription(values.partnersSectionDescription),
    productsSectionTitle: values.productsSectionTitle,
    productsSectionDescription: toNullableDescription(values.productsSectionDescription),
    servicesSectionTitle: values.servicesSectionTitle,
    servicesSectionDescription: toNullableDescription(values.servicesSectionDescription),
    whyTitle: values.whyTitle,
    whyDescription: values.whyDescription,
    whyImageMediaId: toOptionalMediaId(values.whyImageMediaId),
    contactSectionTitle: values.contactSectionTitle,
    contactSectionDescription: toNullableDescription(values.contactSectionDescription),
  };
}
