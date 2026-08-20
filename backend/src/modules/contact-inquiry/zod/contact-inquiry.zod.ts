import { z } from 'zod';

import {
  BaseZodSchema,
  ZodDateNullable,
  ZodString,
  ZodStringNullable,
} from '@/common/base/base.zod';
import { EmailDeliveryStatus } from '@/modules/contact-inquiry/enum/general.enum';

export const ContactInquiryZodSchema = BaseZodSchema.extend({
  fullName: ZodString,
  email: ZodString,
  phone: ZodStringNullable,
  subject: ZodString,
  message: ZodString,
  emailDeliveryStatus: z.nativeEnum(EmailDeliveryStatus),
  emailDeliveredAt: ZodDateNullable,
});

export type ContactInquiryZodType = z.infer<typeof ContactInquiryZodSchema>;
