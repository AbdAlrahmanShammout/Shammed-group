import { z } from 'zod';

import {
  BaseZodSchema,
  ZodBoolean,
  ZodDate,
  ZodNumber,
  ZodNumberNullable,
  ZodString,
  ZodStringNullable,
} from '@/common/base/base.zod';

export const LocationPhoneZodSchema = z.object({
  id: ZodNumber,
  createdAt: ZodDate,
  updatedAt: ZodDate,
  phone: ZodString,
  displayOrder: ZodNumber,
  locationId: ZodNumber,
});

export type LocationPhoneZodType = z.infer<typeof LocationPhoneZodSchema>;

export const LocationZodSchema = BaseZodSchema.extend({
  name: ZodString,
  address: ZodString,
  googleMapsUrl: ZodStringNullable,
  latitude: ZodNumberNullable,
  longitude: ZodNumberNullable,
  isVisible: ZodBoolean,
  isMapVisible: ZodBoolean,
  displayOrder: ZodNumber,
  phones: (z.any().nullish() as z.ZodType<LocationPhoneZodType[] | null | undefined>).optional(),
});

export type LocationZodType = z.infer<typeof LocationZodSchema>;
