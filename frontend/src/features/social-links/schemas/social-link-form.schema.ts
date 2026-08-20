import { z } from 'zod';

import { SOCIAL_PLATFORM_KEYS } from '@/lib/social-platforms';

export const socialLinkFormSchema = z
  .object({
    platform: z.enum(SOCIAL_PLATFORM_KEYS, { errorMap: () => ({ message: 'Select a platform' }) }),
    url: z.string().trim().min(1, 'URL is required'),
    isVisible: z.boolean(),
    displayOrder: z.string().trim(),
  })
  .superRefine((values, context) => {
    try {
      const parsedUrl = new URL(values.url);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error('invalid protocol');
      }
    } catch {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid URL including http:// or https://',
        path: ['url'],
      });
    }
    if (values.displayOrder !== '') {
      const displayOrder = Number(values.displayOrder);
      if (!Number.isInteger(displayOrder) || displayOrder < 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Display order must be a whole number of 0 or greater',
          path: ['displayOrder'],
        });
      }
    }
  });

export type SocialLinkFormValues = z.infer<typeof socialLinkFormSchema>;
