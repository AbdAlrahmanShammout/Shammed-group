import type { ReactElement } from 'react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { appPaths } from '@/config/app-paths';
import { ContactForm } from '@/features/contact/components/contact-form';
import { usePublicSiteSettingsQuery } from '@/features/site-chrome/hooks/use-public-site-settings-query';
import type { HomePageResponse } from '@/generated/public-home.contract';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

type HomeContactSectionProps = {
  readonly homePage: HomePageResponse;
};

export function HomeContactSection({ homePage }: HomeContactSectionProps): ReactElement {
  const siteSettingsQuery = usePublicSiteSettingsQuery();
  const siteSettings = siteSettingsQuery.data?.siteSettings;
  return (
    <section
      aria-labelledby="home-contact-title"
      className="border-t bg-[linear-gradient(180deg,oklch(0.985_0.004_240)_0%,oklch(0.99_0_0)_100%)]"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12 md:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Contact
            </p>
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl" id="home-contact-title">
              {homePage.contactSectionTitle}
            </h2>
            {homePage.contactSectionDescription ? (
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {homePage.contactSectionDescription}
              </p>
            ) : null}
          </div>
          {siteSettingsQuery.isPending ? <p role="status">Loading contact details…</p> : null}
          {siteSettings ? (
            <ul className="flex flex-col gap-4 text-sm">
              <li>
                <a
                  className={cn(
                    'inline-flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground',
                    focusRingClassName,
                  )}
                  href={`mailto:${siteSettings.email}`}
                >
                  <Mail aria-hidden="true" className="size-4 shrink-0" />
                  {siteSettings.email}
                </a>
              </li>
              {siteSettings.phone ? (
                <li>
                  <a
                    className={cn(
                      'inline-flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground',
                      focusRingClassName,
                    )}
                    href={`tel:${siteSettings.phone}`}
                  >
                    <Phone aria-hidden="true" className="size-4 shrink-0" />
                    {siteSettings.phone}
                  </a>
                </li>
              ) : null}
              {siteSettings.whatsApp ? (
                <li className="inline-flex items-center gap-3 text-muted-foreground">
                  <Phone aria-hidden="true" className="size-4 shrink-0" />
                  WhatsApp: {siteSettings.whatsApp}
                </li>
              ) : null}
              {siteSettings.address ? (
                <li className="inline-flex items-start gap-3 text-muted-foreground">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  <span>{siteSettings.address}</span>
                </li>
              ) : null}
            </ul>
          ) : null}
          <Button asChild className="self-start" variant="outline">
            <Link to={appPaths.contact}>
              View locations & details
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="rounded-3xl border border-border/80 bg-background p-5 shadow-xs md:p-8">
          <div className="mb-6 flex flex-col gap-2">
            <h3 className="text-xl font-medium tracking-tight">Send a message</h3>
            <p className="text-sm text-muted-foreground">
              Share your inquiry and our team will get back to you.
            </p>
          </div>
          <ContactForm className="max-w-none" fieldIdPrefix="home-contact-" />
        </div>
      </div>
    </section>
  );
}
