import { z } from 'zod';

export const productFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Product name is required'),
    shortDescription: z.string().trim().min(1, 'Short description is required'),
    detailedDescription: z.string().trim(),
    manufacturer: z.string().trim(),
    categoryId: z.string().trim().min(1, 'Category is required'),
    partnerId: z.string().trim(),
    isVisible: z.boolean(),
    displayOrder: z.string().trim(),
    imageMediaId: z.string().trim(),
  })
  .superRefine((values, context) => {
    const categoryId = Number(values.categoryId);
    if (!Number.isInteger(categoryId) || categoryId < 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Category is required',
        path: ['categoryId'],
      });
    }
    if (values.partnerId !== '') {
      const partnerId = Number(values.partnerId);
      if (!Number.isInteger(partnerId) || partnerId < 1) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Select a valid partner',
          path: ['partnerId'],
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

export type ProductFormValues = z.infer<typeof productFormSchema>;
