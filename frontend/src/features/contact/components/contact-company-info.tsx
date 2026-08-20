import type { ReactElement } from 'react';

import type { SiteSettingsResponse } from '@/generated/public-site.contract';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

type ContactCompanyInfoProps = {
  readonly siteSettings: SiteSettingsResponse;
};

export function ContactCompanyInfo({ siteSettings }: ContactCompanyInfoProps): ReactElement {
  return (
    <section aria-labelledby="contact-company-title" className="flex flex-col gap-2">
      <h2 className="text-2xl font-medium" id="contact-company-title">
        {siteSettings.companyName}
      </h2>
      <a
        className={cn('text-muted-foreground hover:text-foreground', focusRingClassName)}
        href={`mailto:${siteSettings.email}`}
      >
        {siteSettings.email}
      </a>
      {siteSettings.phone ? (
        <a
          className={cn('text-muted-foreground hover:text-foreground', focusRingClassName)}
          href={`tel:${siteSettings.phone}`}
        >
          {siteSettings.phone}
        </a>
      ) : null}
      {siteSettings.whatsApp ? (
        <p className="text-muted-foreground">WhatsApp: {siteSettings.whatsApp}</p>
      ) : null}
      {siteSettings.address ? <p className="text-muted-foreground">{siteSettings.address}</p> : null}
    </section>
  );
}
