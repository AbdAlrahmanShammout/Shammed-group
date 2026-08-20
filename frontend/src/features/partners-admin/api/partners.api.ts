import { requestApi } from '@/api/http-client';
import type {
  CreatePartnerRequestDto,
  DeletePartnerResponseDto,
  GetPartnersResponseDto,
  PartnerResponseDto,
  UpdatePartnerRequestDto,
} from '@/generated/admin-partner.contract';

const ADMIN_PARTNER_PATH = '/admin/partner';
const ADMIN_PARTNER_LIST_LIMIT = 100;

export async function getAdminPartners(): Promise<GetPartnersResponseDto> {
  return requestApi<GetPartnersResponseDto>({
    path: `${ADMIN_PARTNER_PATH}?limit=${ADMIN_PARTNER_LIST_LIMIT}&offset=0`,
    method: 'GET',
  });
}

export async function createAdminPartner(
  input: CreatePartnerRequestDto,
): Promise<PartnerResponseDto> {
  return requestApi<PartnerResponseDto>({
    path: ADMIN_PARTNER_PATH,
    method: 'POST',
    body: input,
  });
}

export async function updateAdminPartner(input: {
  readonly partnerId: number;
  readonly body: UpdatePartnerRequestDto;
}): Promise<PartnerResponseDto> {
  return requestApi<PartnerResponseDto>({
    path: `${ADMIN_PARTNER_PATH}/${input.partnerId}`,
    method: 'PATCH',
    body: input.body,
  });
}

export async function deleteAdminPartner(partnerId: number): Promise<DeletePartnerResponseDto> {
  return requestApi<DeletePartnerResponseDto>({
    path: `${ADMIN_PARTNER_PATH}/${partnerId}`,
    method: 'DELETE',
  });
}
