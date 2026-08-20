import { requestApi } from '@/api/http-client';
import type {
  CreateHomePageRequestDto,
  HomePageResponseDto,
  UpdateHomePageRequestDto,
} from '@/generated/admin-home.contract';

const ADMIN_HOME_PAGE_PATH = '/admin/home-page';

export async function getAdminHomePage(): Promise<HomePageResponseDto> {
  return requestApi<HomePageResponseDto>({
    path: ADMIN_HOME_PAGE_PATH,
    method: 'GET',
  });
}

export async function createAdminHomePage(
  input: CreateHomePageRequestDto,
): Promise<HomePageResponseDto> {
  return requestApi<HomePageResponseDto>({
    path: ADMIN_HOME_PAGE_PATH,
    method: 'POST',
    body: input,
  });
}

export async function updateAdminHomePage(
  input: UpdateHomePageRequestDto,
): Promise<HomePageResponseDto> {
  return requestApi<HomePageResponseDto>({
    path: ADMIN_HOME_PAGE_PATH,
    method: 'PATCH',
    body: input,
  });
}
