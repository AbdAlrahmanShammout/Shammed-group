import { useMutation } from '@tanstack/react-query';

import { createContactInquiry } from '@/features/contact/api/contact-inquiry.api';
import type { CreateContactInquiryRequestDto } from '@/generated/public-contact.contract';

export function useCreateContactInquiryMutation() {
  return useMutation({
    mutationFn: (input: CreateContactInquiryRequestDto) => createContactInquiry(input),
  });
}
