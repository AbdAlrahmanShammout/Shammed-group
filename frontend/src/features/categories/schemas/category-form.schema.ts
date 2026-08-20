import { z } from 'zod';

export const categoryFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Category name is required'),
    description: z.string().trim(),
    isVisible: z.boolean(),
    displayOrder: z.string().trim(),
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

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
