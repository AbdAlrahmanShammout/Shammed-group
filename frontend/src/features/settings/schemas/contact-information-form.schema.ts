import { z } from 'zod';

const contactEmailSchema = z.object({
  label: z.string().trim().min(1, 'Label is required'),
  email: z.string().trim().email('Enter a valid email address'),
});

const contactPhoneSchema = z.object({
  label: z.string().trim().min(1, 'Label is required'),
  phone: z.string().trim().min(1, 'Phone is required'),
});

export const contactInformationFormSchema = z.object({
  emails: z.array(contactEmailSchema).min(1, 'At least one email address is required'),
  whatsApp: z.string().trim(),
  address: z.string().trim(),
  phones: z.array(contactPhoneSchema).min(1, 'At least one phone number is required'),
});

export type ContactInformationFormValues = z.infer<typeof contactInformationFormSchema>;
