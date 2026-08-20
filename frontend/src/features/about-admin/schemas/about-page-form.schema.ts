import { z } from 'zod';

export const aboutPageFormSchema = z.object({
  overview: z.string().trim().min(1, 'Overview is required'),
  overviewImageMediaId: z.string().trim(),
  vision: z.string().trim().min(1, 'Vision is required'),
  mission: z.string().trim().min(1, 'Mission is required'),
  values: z.string().trim().min(1, 'Values is required'),
  capabilities: z.string().trim().min(1, 'Capabilities is required'),
});

export type AboutPageFormValues = z.infer<typeof aboutPageFormSchema>;
