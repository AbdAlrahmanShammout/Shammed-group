import { requestApi } from '@/api/http-client';
import type {
  CreateAboutPageRequestDto,
  AboutPageResponseDto,
  UpdateAboutPageRequestDto,
} from '@/generated/admin-about.contract';

const ADMIN_ABOUT_PAGE_PATH = '/admin/about-page';

export async function getAdminAboutPage(): Promise<AboutPageResponseDto> {
  return requestApi<AboutPageResponseDto>({
    path: ADMIN_ABOUT_PAGE_PATH,
    method: 'GET',
  });
}

export async function createAdminAboutPage(
  input: CreateAboutPageRequestDto,
): Promise<AboutPageResponseDto> {
  return requestApi<AboutPageResponseDto>({
    path: ADMIN_ABOUT_PAGE_PATH,
    method: 'POST',
    body: input,
  });
}

export async function updateAdminAboutPage(
  input: UpdateAboutPageRequestDto,
): Promise<AboutPageResponseDto> {
  return requestApi<AboutPageResponseDto>({
    path: ADMIN_ABOUT_PAGE_PATH,
    method: 'PATCH',
    body: input,
  });
}
