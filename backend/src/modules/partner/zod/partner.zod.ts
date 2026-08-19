import { z } from 'zod';

import {
  BaseZodSchema,
  ZodBoolean,
  ZodNumber,
  ZodNumberNullable,
  ZodString,
  ZodStringNullable,
} from '@/common/base/base.zod';
import { MediaEntity } from '@/modules/media/entity/media.entity';

export const PartnerZodSchema = BaseZodSchema.extend({
  name: ZodString,
  shortDescription: ZodString,
  fullDescription: ZodStringNullable,
  specialization: ZodStringNullable,
  websiteUrl: ZodStringNullable,
  country: ZodStringNullable,
  isVisible: ZodBoolean,
  displayOrder: ZodNumber,
  logoMediaId: ZodNumberNullable,
  logo: (z.any() as z.ZodType<MediaEntity | undefined>).optional(),
});

export type PartnerZodType = z.infer<typeof PartnerZodSchema>;
