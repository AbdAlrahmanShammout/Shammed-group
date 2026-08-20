import { z } from 'zod';

export const serviceFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Service title is required'),
    description: z.string().trim().min(1, 'Description is required'),
    isVisible: z.boolean(),
    displayOrder: z.string().trim(),
    imageMediaId: z.string().trim(),
  })
  .superRefine((values, context) => {
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

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
