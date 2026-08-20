import { toOptionalMediaId } from '@/features/partners-admin/lib/to-optional-media-id';
import type { PartnerFormValues } from '@/features/partners-admin/schemas/partner-form.schema';
import type { UpdatePartnerRequestDto } from '@/generated/admin-partner.contract';

function toNullableText(value: string): string | null {
  return value === '' ? null : value;
}

export function toUpdatePartnerRequest(values: PartnerFormValues): UpdatePartnerRequestDto {
  return {
    name: values.name,
    shortDescription: values.shortDescription,
    fullDescription: toNullableText(values.fullDescription),
    specialization: toNullableText(values.specialization),
    websiteUrl: toNullableText(values.websiteUrl),
    country: toNullableText(values.country),
    isVisible: values.isVisible,
    displayOrder: values.displayOrder === '' ? 0 : Number(values.displayOrder),
    logoMediaId: toOptionalMediaId(values.logoMediaId),
  };
}
