import { BaseEntity } from '@/common/base/base.entity';
import { MediaEntity } from '@/modules/media/entity/media.entity';
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
  logo?: MediaEntity;
  favicon?: MediaEntity;

  constructor(data: SiteSettingsZodType) {
    super();
    Object.assign(this, data);
  }
}
