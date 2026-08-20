import { requestApi } from '@/api/http-client';
import type { AboutPageResponseDto } from '@/generated/public-about.contract';

const ABOUT_PAGE_PATH = '/about-page';

export async function getPublicAboutPage(): Promise<AboutPageResponseDto> {
  return requestApi<AboutPageResponseDto>({
    path: ABOUT_PAGE_PATH,
    method: 'GET',
  });
}
