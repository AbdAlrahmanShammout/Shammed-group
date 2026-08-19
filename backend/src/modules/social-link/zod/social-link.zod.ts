import { z } from 'zod';

import { BaseZodSchema, ZodBoolean, ZodNumber, ZodString } from '@/common/base/base.zod';

export const SocialLinkZodSchema = BaseZodSchema.extend({
  platform: ZodString,
  url: ZodString,
  isVisible: ZodBoolean,
  displayOrder: ZodNumber,
});

export type SocialLinkZodType = z.infer<typeof SocialLinkZodSchema>;
