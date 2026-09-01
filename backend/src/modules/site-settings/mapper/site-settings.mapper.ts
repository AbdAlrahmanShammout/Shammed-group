import { MediaMapper } from '@/modules/media/mapper/media.mapper';
import { SiteSettingsEmailEntity } from '@/modules/site-settings/entity/site-settings-email.entity';
import { SiteSettingsPhoneEntity } from '@/modules/site-settings/entity/site-settings-phone.entity';
import { SiteSettingsEntity } from '@/modules/site-settings/entity/site-settings.entity';
import type { SiteSettingsType } from '@/modules/site-settings/types/site-settings-details-schema.type';

export class SiteSettingsMapper {
  static toEntity(schema: SiteSettingsType): SiteSettingsEntity {
    return new SiteSettingsEntity({
      id: schema.id,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      companyName: schema.companyName,
      companyNameEnglish: schema.companyNameEnglish,
      companyNameArabic: schema.companyNameArabic ?? null,
      email: schema.email,
      phone: schema.phone,
      whatsApp: schema.whatsApp ?? null,
      address: schema.address ?? null,
      logoMediaId: schema.logoMediaId ?? null,
      faviconMediaId: schema.faviconMediaId ?? null,
      placeholderMediaId: schema.placeholderMediaId ?? null,
      primaryColor: schema.primaryColor ?? null,
      accentColor: schema.accentColor ?? null,
      backgroundColor: schema.backgroundColor ?? null,
      textColor: schema.textColor ?? null,
      secondaryColor: schema.secondaryColor ?? null,
      borderColor: schema.borderColor ?? null,
      logo: schema.logo ? MediaMapper.toEntity(schema.logo) : undefined,
      favicon: schema.favicon ? MediaMapper.toEntity(schema.favicon) : undefined,
      placeholder: schema.placeholder ? MediaMapper.toEntity(schema.placeholder) : undefined,
      phones: schema.phones?.map((phone) => SiteSettingsMapper.toPhoneEntity(phone)),
      emails: schema.emails?.map((email) => SiteSettingsMapper.toEmailEntity(email)),
    });
  }

  private static toPhoneEntity(schema: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    label: string;
    phone: string;
    displayOrder: number;
    siteSettingsId: number;
  }): SiteSettingsPhoneEntity {
    const phone = new SiteSettingsPhoneEntity();
    phone.id = schema.id;
    phone.createdAt = schema.createdAt;
    phone.updatedAt = schema.updatedAt;
    phone.label = schema.label;
    phone.phone = schema.phone;
    phone.displayOrder = schema.displayOrder;
    phone.siteSettingsId = schema.siteSettingsId;
    return phone;
  }

  private static toEmailEntity(schema: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    label: string;
    email: string;
    displayOrder: number;
    siteSettingsId: number;
  }): SiteSettingsEmailEntity {
    const email = new SiteSettingsEmailEntity();
    email.id = schema.id;
    email.createdAt = schema.createdAt;
    email.updatedAt = schema.updatedAt;
    email.label = schema.label;
    email.email = schema.email;
    email.displayOrder = schema.displayOrder;
    email.siteSettingsId = schema.siteSettingsId;
    return email;
  }
}

