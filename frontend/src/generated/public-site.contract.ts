/**
 * Wire types for public site-settings and social-link operations.
 * Keep aligned with GET /site-settings and GET /social-link.
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

export type SocialLinkResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly platform: string;
  readonly url: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
};

export type GetSocialLinksResponseDto = {
  readonly socialLinks: readonly SocialLinkResponse[];
  readonly total: number;
};
