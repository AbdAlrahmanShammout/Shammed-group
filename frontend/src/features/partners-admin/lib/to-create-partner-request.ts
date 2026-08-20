import { toOptionalMediaId } from '@/features/partners-admin/lib/to-optional-media-id';
import type { PartnerFormValues } from '@/features/partners-admin/schemas/partner-form.schema';
import type { CreatePartnerRequestDto } from '@/generated/admin-partner.contract';

function toOptionalText(value: string): string | undefined {
  return value === '' ? undefined : value;
}

export function toCreatePartnerRequest(values: PartnerFormValues): CreatePartnerRequestDto {
  const logoMediaId = toOptionalMediaId(values.logoMediaId);
  return {
    name: values.name,
    shortDescription: values.shortDescription,
    fullDescription: toOptionalText(values.fullDescription),
    specialization: toOptionalText(values.specialization),
    websiteUrl: toOptionalText(values.websiteUrl),
    country: toOptionalText(values.country),
    isVisible: values.isVisible,
    displayOrder: values.displayOrder === '' ? 0 : Number(values.displayOrder),
    logoMediaId: logoMediaId ?? undefined,
  };
}
