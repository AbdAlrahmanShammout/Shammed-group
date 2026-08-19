import { z } from 'zod';

import {
  BaseZodSchema,
  ZodNumberNullable,
  ZodString,
  ZodStringNullable,
} from '@/common/base/base.zod';
import { MediaEntity } from '@/modules/media/entity/media.entity';

export const SiteSettingsZodSchema = BaseZodSchema.extend({
  companyName: ZodString,
  companyNameEnglish: ZodString,
  companyNameArabic: ZodStringNullable,
  email: ZodString,
  phone: ZodString,
  whatsApp: ZodStringNullable,
  address: ZodStringNullable,
  logoMediaId: ZodNumberNullable,
  faviconMediaId: ZodNumberNullable,
  logo: (z.any() as z.ZodType<MediaEntity | undefined>).optional(),
  favicon: (z.any() as z.ZodType<MediaEntity | undefined>).optional(),
});

export type SiteSettingsZodType = z.infer<typeof SiteSettingsZodSchema>;
