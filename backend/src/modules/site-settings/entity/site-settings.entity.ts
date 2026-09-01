import { BaseEntity } from '@/common/base/base.entity';
import { MediaEntity } from '@/modules/media/entity/media.entity';
import { SiteSettingsEmailEntity } from '@/modules/site-settings/entity/site-settings-email.entity';
import { SiteSettingsPhoneEntity } from '@/modules/site-settings/entity/site-settings-phone.entity';
import { SiteSettingsZodType } from '@/modules/site-settings/zod/site-settings.zod';

export class SiteSettingsEntity extends BaseEntity {
  companyName!: string;
  companyNameEnglish!: string;
  companyNameArabic!: string | null;
  email!: string;
  phone!: string;
  whatsApp!: string | null;
  address!: string | null;
  logoMediaId!: number | null;
  faviconMediaId!: number | null;
  placeholderMediaId!: number | null;
  primaryColor!: string | null;
  accentColor!: string | null;
  backgroundColor!: string | null;
  textColor!: string | null;
  secondaryColor!: string | null;
  borderColor!: string | null;
  logo?: MediaEntity;
  favicon?: MediaEntity;
  placeholder?: MediaEntity;
  phones?: SiteSettingsPhoneEntity[];
  emails?: SiteSettingsEmailEntity[];

  constructor(data: SiteSettingsZodType) {
    super();
    Object.assign(this, data);
  }
}
