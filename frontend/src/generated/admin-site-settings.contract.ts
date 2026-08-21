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
  readonly placeholderMediaId?: number;
  readonly primaryColor?: string;
  readonly accentColor?: string;
  readonly backgroundColor?: string;
  readonly textColor?: string;
  readonly secondaryColor?: string;
  readonly borderColor?: string;
  readonly logo?: MediaResponse;
  readonly favicon?: MediaResponse;
  readonly placeholder?: MediaResponse;
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
  readonly placeholderMediaId?: number;
  readonly primaryColor?: string;
  readonly accentColor?: string;
  readonly backgroundColor?: string;
  readonly textColor?: string;
  readonly secondaryColor?: string;
  readonly borderColor?: string;
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
  readonly placeholderMediaId?: number | null;
  readonly primaryColor?: string | null;
  readonly accentColor?: string | null;
  readonly backgroundColor?: string | null;
  readonly textColor?: string | null;
  readonly secondaryColor?: string | null;
  readonly borderColor?: string | null;
};
