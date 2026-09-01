type SiteContactEmail = {
  readonly label: string;
  readonly email: string;
};

type SiteContactEmailsInput = {
  readonly email: string;
  readonly emails?: readonly SiteContactEmail[];
};

export function toSiteContactEmails(siteSettings: SiteContactEmailsInput): readonly SiteContactEmail[] {
  if (siteSettings.emails && siteSettings.emails.length > 0) {
    return siteSettings.emails.map((emailItem) => ({
      label: emailItem.label,
      email: emailItem.email,
    }));
  }
  if (siteSettings.email === '') {
    return [];
  }
  return [{ label: 'Email', email: siteSettings.email }];
}
