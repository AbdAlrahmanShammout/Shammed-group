import { z } from 'zod';

import { BaseZodSchema, ZodNumberNullable, ZodString } from '@/common/base/base.zod';
import { MediaEntity } from '@/modules/media/entity/media.entity';

export const AboutPageZodSchema = BaseZodSchema.extend({
  overview: ZodString,
  overviewImageMediaId: ZodNumberNullable,
  vision: ZodString,
  mission: ZodString,
  values: ZodString,
  capabilities: ZodString,
  overviewImage: (z.any() as z.ZodType<MediaEntity | undefined>).optional(),
});

export type AboutPageZodType = z.infer<typeof AboutPageZodSchema>;
