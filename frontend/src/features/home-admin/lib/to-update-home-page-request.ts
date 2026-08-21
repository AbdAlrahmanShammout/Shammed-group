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
    whyEyebrow: values.whyEyebrow,
    whyReason1Title: values.whyReason1Title,
    whyReason1Description: values.whyReason1Description,
    whyReason2Title: values.whyReason2Title,
    whyReason2Description: values.whyReason2Description,
    whyReason3Title: values.whyReason3Title,
    whyReason3Description: values.whyReason3Description,
    whyReason4Title: values.whyReason4Title,
    whyReason4Description: values.whyReason4Description,
    whyImageMediaId: toOptionalMediaId(values.whyImageMediaId),
    heroEyebrow: values.heroEyebrow,
    aboutEyebrow: values.aboutEyebrow,
    aboutMetric1Value: values.aboutMetric1Value,
    aboutMetric1Label: values.aboutMetric1Label,
    aboutMetric2Value: values.aboutMetric2Value,
    aboutMetric2Label: values.aboutMetric2Label,
    aboutMetric3Value: values.aboutMetric3Value,
    aboutMetric3Label: values.aboutMetric3Label,
    contactSectionTitle: values.contactSectionTitle,
    contactSectionDescription: toNullableDescription(values.contactSectionDescription),
  };
}
