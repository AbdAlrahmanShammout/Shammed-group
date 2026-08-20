import { requestApi } from '@/api/http-client';
import type {
  ContactInquiryResponseDto,
  EmailDeliveryStatus,
  GetContactInquiriesResponseDto,
} from '@/generated/admin-contact-inquiry.contract';

const BASE_PATH = '/admin/contact-inquiry';

export async function getAdminContactInquiries(params: {
  readonly limit: number;
  readonly offset: number;
  readonly status?: EmailDeliveryStatus;
}): Promise<GetContactInquiriesResponseDto> {
  const query = new URLSearchParams();
  query.set('limit', String(params.limit));
  query.set('offset', String(params.offset));
  if (params.status) {
    query.set('status', params.status);
  }
  return requestApi<GetContactInquiriesResponseDto>({
    path: `${BASE_PATH}?${query.toString()}`,
    method: 'GET',
  });
}

export async function getAdminContactInquiry(id: number): Promise<ContactInquiryResponseDto> {
  return requestApi<ContactInquiryResponseDto>({
    path: `${BASE_PATH}/${id}`,
    method: 'GET',
  });
}

export async function resendContactInquiryNotification(
  id: number,
): Promise<ContactInquiryResponseDto> {
  return requestApi<ContactInquiryResponseDto>({
    path: `${BASE_PATH}/${id}/resend`,
    method: 'POST',
  });
}
