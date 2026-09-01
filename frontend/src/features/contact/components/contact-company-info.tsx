import type { ReactElement } from 'react';

import type { SiteSettingsResponse } from '@/generated/public-site.contract';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { toSiteContactEmails } from '@/lib/to-site-contact-emails';
import { toSiteContactPhones } from '@/lib/to-site-contact-phones';
import { cn } from '@/lib/utils';

type ContactCompanyInfoProps = {
  readonly siteSettings: SiteSettingsResponse;
};

export function ContactCompanyInfo({ siteSettings }: ContactCompanyInfoProps): ReactElement {
  const emails = toSiteContactEmails(siteSettings);
  const phones = toSiteContactPhones(siteSettings);
  return (
    <section aria-labelledby="contact-company-title" className="flex flex-col gap-2">
      <h2 className="text-2xl font-medium" id="contact-company-title">
        {siteSettings.companyName}
      </h2>
      {emails.map((emailItem) => (
        <p className="flex flex-col gap-0.5" key={`${emailItem.label}-${emailItem.email}`}>
          <span className="text-sm font-medium text-foreground">{emailItem.label}</span>
          <a
            className={cn('text-muted-foreground hover:text-foreground', focusRingClassName)}
            href={`mailto:${emailItem.email}`}
          >
            {emailItem.email}
          </a>
        </p>
      ))}
      {phones.map((phoneItem) => (
        <p className="flex flex-col gap-0.5" key={`${phoneItem.label}-${phoneItem.phone}`}>
          <span className="text-sm font-medium text-foreground">{phoneItem.label}</span>
          <a
            className={cn('text-muted-foreground hover:text-foreground', focusRingClassName)}
            href={`tel:${phoneItem.phone}`}
          >
            {phoneItem.phone}
          </a>
        </p>
      ))}
      {siteSettings.whatsApp ? (
        <p className="text-muted-foreground">WhatsApp: {siteSettings.whatsApp}</p>
      ) : null}
      {siteSettings.address ? <p className="text-muted-foreground">{siteSettings.address}</p> : null}
    </section>
  );
}
