import { requestApi } from '@/api/http-client';
import type { GetPublicHomePageResponseDto } from '@/generated/public-home.contract';

const HOME_PAGE_PATH = '/home-page';

export async function getPublicHomePage(): Promise<GetPublicHomePageResponseDto> {
  return requestApi<GetPublicHomePageResponseDto>({
    path: HOME_PAGE_PATH,
    method: 'GET',
  });
}
