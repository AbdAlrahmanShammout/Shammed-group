import { z } from 'zod';

const locationPhoneSchema = z.object({
  phone: z.string().trim().min(1, 'Phone is required'),
});

export const locationFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Location name is required'),
    address: z.string().trim().min(1, 'Address is required'),
    googleMapsUrl: z.string().trim(),
    latitude: z.string().trim(),
    longitude: z.string().trim(),
    isVisible: z.boolean(),
    displayOrder: z.string().trim(),
    phones: z.array(locationPhoneSchema).min(1, 'At least one phone number is required'),
  })
  .superRefine((values, context) => {
    const hasLatitude = values.latitude !== '';
    const hasLongitude = values.longitude !== '';
    if (hasLatitude !== hasLongitude) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Latitude and longitude must both be provided or both omitted',
        path: hasLatitude ? ['longitude'] : ['latitude'],
      });
    }
    if (hasLatitude) {
      const latitude = Number(values.latitude);
      if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Latitude must be between -90 and 90',
          path: ['latitude'],
        });
      }
    }
    if (hasLongitude) {
      const longitude = Number(values.longitude);
      if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Longitude must be between -180 and 180',
          path: ['longitude'],
        });
      }
    }
    if (values.googleMapsUrl !== '') {
      try {
        const parsedUrl = new URL(values.googleMapsUrl);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
          throw new Error('invalid protocol');
        }
      } catch {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid URL including http:// or https://',
          path: ['googleMapsUrl'],
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

export type LocationFormValues = z.infer<typeof locationFormSchema>;
