import { requestApi } from '@/api/http-client';
import type { SiteSettingsResponseDto } from '@/generated/public-site.contract';

const SITE_SETTINGS_PATH = '/site-settings';

export async function getPublicSiteSettings(): Promise<SiteSettingsResponseDto> {
  return requestApi<SiteSettingsResponseDto>({
    path: SITE_SETTINGS_PATH,
    method: 'GET',
  });
}
