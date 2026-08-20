import { z } from 'zod';

export const contactInformationFormSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(1, 'Phone is required'),
  whatsApp: z.string().trim(),
  address: z.string().trim(),
});

export type ContactInformationFormValues = z.infer<typeof contactInformationFormSchema>;
