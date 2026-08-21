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
    whyEyebrow: values.whyEyebrow,
    whyReason1Title: values.whyReason1Title,
    whyReason1Description: values.whyReason1Description,
    whyReason2Title: values.whyReason2Title,
    whyReason2Description: values.whyReason2Description,
    whyReason3Title: values.whyReason3Title,
    whyReason3Description: values.whyReason3Description,
    whyReason4Title: values.whyReason4Title,
    whyReason4Description: values.whyReason4Description,
    whyImageMediaId: whyImageMediaId ?? undefined,
    heroEyebrow: values.heroEyebrow,
    aboutEyebrow: values.aboutEyebrow,
    aboutMetric1Value: values.aboutMetric1Value,
    aboutMetric1Label: values.aboutMetric1Label,
    aboutMetric2Value: values.aboutMetric2Value,
    aboutMetric2Label: values.aboutMetric2Label,
    aboutMetric3Value: values.aboutMetric3Value,
    aboutMetric3Label: values.aboutMetric3Label,
    contactSectionTitle: values.contactSectionTitle,
    contactSectionDescription: toOptionalDescription(values.contactSectionDescription),
  };
}
