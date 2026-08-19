import { MediaMapper } from '@/modules/media/mapper/media.mapper';
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
      logo: schema.logo ? MediaMapper.toEntity(schema.logo) : undefined,
      favicon: schema.favicon ? MediaMapper.toEntity(schema.favicon) : undefined,
    });
  }
}
