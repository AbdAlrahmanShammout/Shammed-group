import { z } from 'zod';

export const companySettingsFormSchema = z.object({
  companyName: z.string().trim().min(1, 'Company name is required'),
  companyNameEnglish: z.string().trim().min(1, 'English company name is required'),
  companyNameArabic: z.string().trim(),
  phone: z.string().trim().min(1, 'Phone is required'),
  logoMediaId: z.string().trim(),
  faviconMediaId: z.string().trim(),
});

export type CompanySettingsFormValues = z.infer<typeof companySettingsFormSchema>;
