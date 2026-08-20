import { requestApi } from '@/api/http-client';
import type {
  CreateSocialLinkRequestDto,
  DeleteSocialLinkResponseDto,
  GetSocialLinksResponseDto,
  SocialLinkResponseDto,
  UpdateSocialLinkRequestDto,
} from '@/generated/admin-social-link.contract';

const ADMIN_SOCIAL_LINK_PATH = '/admin/social-link';
const ADMIN_SOCIAL_LINK_LIST_LIMIT = 100;

export async function getAdminSocialLinks(): Promise<GetSocialLinksResponseDto> {
  return requestApi<GetSocialLinksResponseDto>({
    path: `${ADMIN_SOCIAL_LINK_PATH}?limit=${ADMIN_SOCIAL_LINK_LIST_LIMIT}&offset=0`,
    method: 'GET',
  });
}

export async function createAdminSocialLink(
  input: CreateSocialLinkRequestDto,
): Promise<SocialLinkResponseDto> {
  return requestApi<SocialLinkResponseDto>({
    path: ADMIN_SOCIAL_LINK_PATH,
    method: 'POST',
    body: input,
  });
}

export async function updateAdminSocialLink(input: {
  readonly socialLinkId: number;
  readonly body: UpdateSocialLinkRequestDto;
}): Promise<SocialLinkResponseDto> {
  return requestApi<SocialLinkResponseDto>({
    path: `${ADMIN_SOCIAL_LINK_PATH}/${input.socialLinkId}`,
    method: 'PATCH',
    body: input.body,
  });
}

export async function deleteAdminSocialLink(
  socialLinkId: number,
): Promise<DeleteSocialLinkResponseDto> {
  return requestApi<DeleteSocialLinkResponseDto>({
    path: `${ADMIN_SOCIAL_LINK_PATH}/${socialLinkId}`,
    method: 'DELETE',
  });
}
