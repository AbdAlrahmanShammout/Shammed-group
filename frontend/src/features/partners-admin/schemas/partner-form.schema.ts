import { z } from 'zod';

export const partnerFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Partner name is required'),
    shortDescription: z.string().trim().min(1, 'Short description is required'),
    fullDescription: z.string().trim(),
    specialization: z.string().trim(),
    websiteUrl: z.string().trim(),
    country: z.string().trim(),
    isVisible: z.boolean(),
    displayOrder: z.string().trim(),
    logoMediaId: z.string().trim(),
  })
  .superRefine((values, context) => {
    if (values.websiteUrl !== '') {
      try {
        const parsedUrl = new URL(values.websiteUrl);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
          throw new Error('invalid protocol');
        }
      } catch {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid URL including http:// or https://',
          path: ['websiteUrl'],
        });
      }
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

export type PartnerFormValues = z.infer<typeof partnerFormSchema>;
