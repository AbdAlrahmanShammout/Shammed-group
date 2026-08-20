import { requestApi } from '@/api/http-client';
import type {
  CreateContactInquiryRequestDto,
  CreateContactInquiryResponseDto,
} from '@/generated/public-contact.contract';

const CONTACT_INQUIRY_PATH = '/contact-inquiry';

export async function createContactInquiry(
  input: CreateContactInquiryRequestDto,
): Promise<CreateContactInquiryResponseDto> {
  return requestApi<CreateContactInquiryResponseDto>({
    path: CONTACT_INQUIRY_PATH,
    method: 'POST',
    body: input,
  });
}
