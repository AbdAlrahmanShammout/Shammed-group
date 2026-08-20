import { requestApi } from '@/api/http-client';
import type { GetPartnersResponseDto } from '@/generated/admin-partner.contract';

const ADMIN_PARTNER_PATH = '/admin/partner';
const ADMIN_PARTNER_LIST_LIMIT = 100;

export async function getAdminPartnersForSelect(): Promise<GetPartnersResponseDto> {
  return requestApi<GetPartnersResponseDto>({
    path: `${ADMIN_PARTNER_PATH}?limit=${ADMIN_PARTNER_LIST_LIMIT}&offset=0`,
    method: 'GET',
  });
}
