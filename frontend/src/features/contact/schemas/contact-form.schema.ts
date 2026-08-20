import { z } from 'zod';

const CONTACT_INQUIRY_FULL_NAME_MAX_LENGTH = 200;
const CONTACT_INQUIRY_EMAIL_MAX_LENGTH = 254;
const CONTACT_INQUIRY_PHONE_MAX_LENGTH = 50;
const CONTACT_INQUIRY_SUBJECT_MAX_LENGTH = 200;
const CONTACT_INQUIRY_MESSAGE_MAX_LENGTH = 5000;

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .max(CONTACT_INQUIRY_FULL_NAME_MAX_LENGTH, 'Full name is too long'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .max(CONTACT_INQUIRY_EMAIL_MAX_LENGTH, 'Email is too long'),
  phone: z.string().trim().max(CONTACT_INQUIRY_PHONE_MAX_LENGTH, 'Phone number is too long'),
  subject: z
    .string()
    .trim()
    .min(1, 'Subject is required')
    .max(CONTACT_INQUIRY_SUBJECT_MAX_LENGTH, 'Subject is too long'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(CONTACT_INQUIRY_MESSAGE_MAX_LENGTH, 'Message is too long'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
