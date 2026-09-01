export type SiteSettingsPhoneRepoInput = {
  readonly label: string;
  readonly phone: string;
  readonly displayOrder: number;
};

export type SiteSettingsEmailRepoInput = {
  readonly label: string;
  readonly email: string;
  readonly displayOrder: number;
};

export type CreateSiteSettingsRepoInput = {
  readonly companyName: string;
  readonly companyNameEnglish: string;
  readonly companyNameArabic: string | null;
  readonly email: string;
  readonly emails: readonly SiteSettingsEmailRepoInput[];
  readonly phone: string;
  readonly phones: readonly SiteSettingsPhoneRepoInput[];
  readonly whatsApp: string | null;
  readonly address: string | null;
  readonly logoMediaId: number | null;
  readonly faviconMediaId: number | null;
  readonly placeholderMediaId: number | null;
  readonly primaryColor: string | null;
  readonly accentColor: string | null;
  readonly backgroundColor: string | null;
  readonly textColor: string | null;
  readonly secondaryColor: string | null;
  readonly borderColor: string | null;
};

export type UpdateSiteSettingsRepoInput = {
  readonly id: number;
  readonly companyName?: string;
  readonly companyNameEnglish?: string;
  readonly companyNameArabic?: string | null;
  readonly email?: string;
  readonly emails?: readonly SiteSettingsEmailRepoInput[];
  readonly phone?: string;
  readonly phones?: readonly SiteSettingsPhoneRepoInput[];
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
