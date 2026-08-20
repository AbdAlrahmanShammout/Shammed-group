import type { ReactElement } from 'react';

import { ContactCompanyInfo } from '@/features/contact/components/contact-company-info';
import { ContactForm } from '@/features/contact/components/contact-form';
import { ContactLocationsList } from '@/features/contact/components/contact-locations-list';
import { ContactSocialLinks } from '@/features/contact/components/contact-social-links';
import { useContactSiteSettingsQuery } from '@/features/contact/hooks/use-contact-site-settings-query';
import { useContactSocialLinksQuery } from '@/features/contact/hooks/use-contact-social-links-query';
import { usePublicLocationsQuery } from '@/features/contact/hooks/use-public-locations-query';

export function PublicContactPage(): ReactElement {
  const siteSettingsQuery = useContactSiteSettingsQuery();
  const locationsQuery = usePublicLocationsQuery();
  const socialLinksQuery = useContactSocialLinksQuery();
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 md:px-6">
      <h1 className="text-3xl font-medium">Contact Us</h1>
      {siteSettingsQuery.isPending ? <p role="status">Loading contact details…</p> : null}
      {siteSettingsQuery.isError ? (
        <p role="alert">Unable to load company contact details.</p>
      ) : null}
      {siteSettingsQuery.data ? (
        <ContactCompanyInfo siteSettings={siteSettingsQuery.data.siteSettings} />
      ) : null}
      <section aria-labelledby="contact-locations-title" className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium" id="contact-locations-title">
          Locations
        </h2>
        {locationsQuery.isPending ? <p role="status">Loading locations…</p> : null}
        {locationsQuery.isError ? <p role="alert">Unable to load locations.</p> : null}
        {locationsQuery.data ? (
          <ContactLocationsList locations={locationsQuery.data.locations} />
        ) : null}
      </section>
      {socialLinksQuery.isPending ? <p role="status">Loading social links…</p> : null}
      {socialLinksQuery.isError ? <p role="alert">Unable to load social links.</p> : null}
      {socialLinksQuery.data ? (
        <ContactSocialLinks socialLinks={socialLinksQuery.data.socialLinks} />
      ) : null}
      <section aria-labelledby="contact-form-title" className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium" id="contact-form-title">
          Contact form
        </h2>
        <ContactForm />
      </section>
    </div>
  );
}
