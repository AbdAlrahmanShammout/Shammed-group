import { z } from 'zod';

export const homePageFormSchema = z.object({
  heroTitle: z.string().trim().min(1, 'Hero title is required'),
  heroDescription: z.string().trim().min(1, 'Hero description is required'),
  heroImageMediaId: z.string().trim(),
  primaryCtaText: z.string().trim().min(1, 'Primary CTA text is required'),
  primaryCtaUrl: z.string().trim().min(1, 'Primary CTA URL is required'),
  secondaryCtaText: z.string().trim().min(1, 'Secondary CTA text is required'),
  secondaryCtaUrl: z.string().trim().min(1, 'Secondary CTA URL is required'),
  aboutPreviewTitle: z.string().trim().min(1, 'About preview title is required'),
  aboutPreviewDescription: z.string().trim().min(1, 'About preview description is required'),
  aboutPreviewImageMediaId: z.string().trim(),
  aboutPreviewCtaText: z.string().trim().min(1, 'About preview CTA text is required'),
  aboutPreviewCtaUrl: z.string().trim().min(1, 'About preview CTA URL is required'),
  partnersSectionTitle: z.string().trim().min(1, 'Partners section title is required'),
  partnersSectionDescription: z.string().trim(),
  productsSectionTitle: z.string().trim().min(1, 'Products section title is required'),
  productsSectionDescription: z.string().trim(),
  servicesSectionTitle: z.string().trim().min(1, 'Services section title is required'),
  servicesSectionDescription: z.string().trim(),
  whyTitle: z.string().trim().min(1, 'Why section title is required'),
  whyDescription: z.string().trim().min(1, 'Why section description is required'),
  whyImageMediaId: z.string().trim(),
  contactSectionTitle: z.string().trim().min(1, 'Contact section title is required'),
  contactSectionDescription: z.string().trim(),
});

export type HomePageFormValues = z.infer<typeof homePageFormSchema>;
