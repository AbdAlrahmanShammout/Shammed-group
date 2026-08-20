import { requestApi } from '@/api/http-client';
import type { GetPartnersResponseDto } from '@/generated/public-partner.contract';

const PARTNERS_PATH = '/partner';

export async function getPublicPartners(): Promise<GetPartnersResponseDto> {
  return requestApi<GetPartnersResponseDto>({
    path: PARTNERS_PATH,
    method: 'GET',
  });
}
