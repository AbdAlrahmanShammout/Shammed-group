/**
 * Wire types for admin site-settings on the admin OpenAPI document.
 * Keep aligned with /admin/site-settings.
 * Do not import backend source types.
 */
export type MediaResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly originalFileName: string;
  readonly mimeType: string;
  readonly byteSize: number;
};

export type SiteSettingsResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly companyName: string;
  readonly companyNameEnglish: string;
  readonly companyNameArabic?: string;
  readonly email: string;
  readonly phone: string;
  readonly whatsApp?: string;
  readonly address?: string;
  readonly logoMediaId?: number;
  readonly faviconMediaId?: number;
  readonly logo?: MediaResponse;
  readonly favicon?: MediaResponse;
};

export type SiteSettingsResponseDto = {
  readonly siteSettings: SiteSettingsResponse;
};

export type CreateSiteSettingsRequestDto = {
  readonly companyName: string;
  readonly companyNameEnglish: string;
  readonly companyNameArabic?: string;
  readonly email?: string;
  readonly phone: string;
  readonly whatsApp?: string;
  readonly address?: string;
  readonly logoMediaId?: number;
  readonly faviconMediaId?: number;
};

export type UpdateSiteSettingsRequestDto = {
  readonly companyName?: string;
  readonly companyNameEnglish?: string;
  readonly companyNameArabic?: string | null;
  readonly email?: string;
  readonly phone?: string;
  readonly whatsApp?: string | null;
  readonly address?: string | null;
  readonly logoMediaId?: number | null;
  readonly faviconMediaId?: number | null;
};
