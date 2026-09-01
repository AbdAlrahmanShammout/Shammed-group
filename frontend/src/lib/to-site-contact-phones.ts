type SiteContactPhone = {
  readonly label: string;
  readonly phone: string;
};

type SiteContactPhonesInput = {
  readonly phone: string;
  readonly phones?: readonly SiteContactPhone[];
};

export function toSiteContactPhones(siteSettings: SiteContactPhonesInput): readonly SiteContactPhone[] {
  if (siteSettings.phones && siteSettings.phones.length > 0) {
    return siteSettings.phones.map((phoneItem) => ({
      label: phoneItem.label,
      phone: phoneItem.phone,
    }));
  }
  if (siteSettings.phone === '') {
    return [];
  }
  return [{ label: 'Phone', phone: siteSettings.phone }];
}
