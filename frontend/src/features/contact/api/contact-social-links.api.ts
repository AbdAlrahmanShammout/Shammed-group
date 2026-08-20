import { requestApi } from '@/api/http-client';
import type { GetSocialLinksResponseDto } from '@/generated/public-site.contract';

const SOCIAL_LINKS_PATH = '/social-link';

export async function getContactSocialLinks(): Promise<GetSocialLinksResponseDto> {
  return requestApi<GetSocialLinksResponseDto>({
    path: SOCIAL_LINKS_PATH,
    method: 'GET',
  });
}
