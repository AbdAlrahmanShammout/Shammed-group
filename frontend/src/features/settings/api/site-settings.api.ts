import { requestApi } from '@/api/http-client';
import type {
  CreateSiteSettingsRequestDto,
  SiteSettingsResponseDto,
  UpdateSiteSettingsRequestDto,
} from '@/generated/admin-site-settings.contract';

const ADMIN_SITE_SETTINGS_PATH = '/admin/site-settings';

export async function getAdminSiteSettings(): Promise<SiteSettingsResponseDto> {
  return requestApi<SiteSettingsResponseDto>({
    path: ADMIN_SITE_SETTINGS_PATH,
    method: 'GET',
  });
}

export async function createAdminSiteSettings(
  input: CreateSiteSettingsRequestDto,
): Promise<SiteSettingsResponseDto> {
  return requestApi<SiteSettingsResponseDto>({
    path: ADMIN_SITE_SETTINGS_PATH,
    method: 'POST',
    body: input,
  });
}

export async function updateAdminSiteSettings(
  input: UpdateSiteSettingsRequestDto,
): Promise<SiteSettingsResponseDto> {
  return requestApi<SiteSettingsResponseDto>({
    path: ADMIN_SITE_SETTINGS_PATH,
    method: 'PATCH',
    body: input,
  });
}
