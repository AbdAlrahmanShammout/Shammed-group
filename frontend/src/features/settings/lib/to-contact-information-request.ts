import type { ContactInformationFormValues } from '@/features/settings/schemas/contact-information-form.schema';
import type { UpdateSiteSettingsRequestDto } from '@/generated/admin-site-settings.contract';

export function toContactInformationRequest(
  values: ContactInformationFormValues,
): UpdateSiteSettingsRequestDto {
  return {
    emails: values.emails.map((emailItem, index) => ({
      label: emailItem.label,
      email: emailItem.email,
      displayOrder: index,
    })),
    whatsApp: values.whatsApp === '' ? null : values.whatsApp,
    address: values.address === '' ? null : values.address,
    phones: values.phones.map((phoneItem, index) => ({
      label: phoneItem.label,
      phone: phoneItem.phone,
      displayOrder: index,
    })),
  };
}
