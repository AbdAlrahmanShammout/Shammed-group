import { z } from 'zod';

import {
  BaseZodSchema,
  ZodNumberNullable,
  ZodString,
  ZodStringNullable,
} from '@/common/base/base.zod';
import { MediaEntity } from '@/modules/media/entity/media.entity';

export const HomePageZodSchema = BaseZodSchema.extend({
  heroTitle: ZodString,
  heroDescription: ZodString,
  heroImageMediaId: ZodNumberNullable,
  primaryCtaText: ZodString,
  primaryCtaUrl: ZodString,
  secondaryCtaText: ZodString,
  secondaryCtaUrl: ZodString,
  aboutPreviewTitle: ZodString,
  aboutPreviewDescription: ZodString,
  aboutPreviewImageMediaId: ZodNumberNullable,
  aboutPreviewCtaText: ZodString,
  aboutPreviewCtaUrl: ZodString,
  partnersSectionTitle: ZodString,
  partnersSectionDescription: ZodStringNullable,
  productsSectionTitle: ZodString,
  productsSectionDescription: ZodStringNullable,
  servicesSectionTitle: ZodString,
  servicesSectionDescription: ZodStringNullable,
  whyTitle: ZodString,
  whyDescription: ZodString,
  whyImageMediaId: ZodNumberNullable,
  contactSectionTitle: ZodString,
  contactSectionDescription: ZodStringNullable,
  heroImage: (z.any() as z.ZodType<MediaEntity | undefined>).optional(),
  aboutPreviewImage: (z.any() as z.ZodType<MediaEntity | undefined>).optional(),
  whyImage: (z.any() as z.ZodType<MediaEntity | undefined>).optional(),
});

export type HomePageZodType = z.infer<typeof HomePageZodSchema>;
