import { z } from 'zod';

import {
  BaseZodSchema,
  ZodDate,
  ZodNumber,
  ZodNumberNullable,
  ZodString,
  ZodStringNullable,
} from '@/common/base/base.zod';
import { MediaEntity } from '@/modules/media/entity/media.entity';

export const SiteSettingsPhoneZodSchema = z.object({
  id: ZodNumber,
  createdAt: ZodDate,
  updatedAt: ZodDate,
  label: ZodString,
  phone: ZodString,
  displayOrder: ZodNumber,
  siteSettingsId: ZodNumber,
});

export type SiteSettingsPhoneZodType = z.infer<typeof SiteSettingsPhoneZodSchema>;

export const SiteSettingsEmailZodSchema = z.object({
  id: ZodNumber,
  createdAt: ZodDate,
  updatedAt: ZodDate,
  label: ZodString,
  email: ZodString,
  displayOrder: ZodNumber,
  siteSettingsId: ZodNumber,
});

export type SiteSettingsEmailZodType = z.infer<typeof SiteSettingsEmailZodSchema>;

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
  placeholderMediaId: ZodNumberNullable,
  primaryColor: ZodStringNullable,
  accentColor: ZodStringNullable,
  backgroundColor: ZodStringNullable,
  textColor: ZodStringNullable,
  secondaryColor: ZodStringNullable,
  borderColor: ZodStringNullable,
  logo: (z.any() as z.ZodType<MediaEntity | undefined>).optional(),
  favicon: (z.any() as z.ZodType<MediaEntity | undefined>).optional(),
  placeholder: (z.any() as z.ZodType<MediaEntity | undefined>).optional(),
  phones: (z.any().nullish() as z.ZodType<SiteSettingsPhoneZodType[] | null | undefined>).optional(),
  emails: (z.any().nullish() as z.ZodType<SiteSettingsEmailZodType[] | null | undefined>).optional(),
});

export type SiteSettingsZodType = z.infer<typeof SiteSettingsZodSchema>;
