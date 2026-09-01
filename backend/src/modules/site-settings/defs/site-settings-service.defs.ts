export type SiteSettingsPhoneServiceInput = {
  readonly label: string;
  readonly phone: string;
  readonly displayOrder?: number;
};

export type SiteSettingsEmailServiceInput = {
  readonly label: string;
  readonly email: string;
  readonly displayOrder?: number;
};

export type CreateSiteSettingsServiceInput = {
  readonly companyName: string;
  readonly companyNameEnglish: string;
  readonly companyNameArabic?: string;
  readonly email?: string;
  readonly emails?: readonly SiteSettingsEmailServiceInput[];
  readonly phone: string;
  readonly phones?: readonly SiteSettingsPhoneServiceInput[];
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

export type UpdateSiteSettingsServiceInput = {
  readonly companyName?: string;
  readonly companyNameEnglish?: string;
  readonly companyNameArabic?: string | null;
  readonly email?: string;
  readonly emails?: readonly SiteSettingsEmailServiceInput[];
  readonly phone?: string;
  readonly phones?: readonly SiteSettingsPhoneServiceInput[];
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
