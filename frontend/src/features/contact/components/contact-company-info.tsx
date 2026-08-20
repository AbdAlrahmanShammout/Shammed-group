import type { ReactElement } from 'react';

import type { SiteSettingsResponse } from '@/generated/public-site.contract';

type ContactCompanyInfoProps = {
  readonly siteSettings: SiteSettingsResponse;
};

export function ContactCompanyInfo({ siteSettings }: ContactCompanyInfoProps): ReactElement {
  return (
    <section aria-labelledby="contact-company-title" className="flex flex-col gap-2">
      <h2 className="text-2xl font-medium" id="contact-company-title">
        {siteSettings.companyName}
      </h2>
      <a className="text-muted-foreground hover:text-foreground" href={`mailto:${siteSettings.email}`}>
        {siteSettings.email}
      </a>
      {siteSettings.phone ? <p className="text-muted-foreground">{siteSettings.phone}</p> : null}
      {siteSettings.whatsApp ? (
        <p className="text-muted-foreground">WhatsApp: {siteSettings.whatsApp}</p>
      ) : null}
      {siteSettings.address ? <p className="text-muted-foreground">{siteSettings.address}</p> : null}
    </section>
  );
}
