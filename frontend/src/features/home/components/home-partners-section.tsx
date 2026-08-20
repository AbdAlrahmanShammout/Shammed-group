import type { ReactElement } from 'react';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { LogoMediaFrame } from '@/components/media/logo-media-frame';
import { Button } from '@/components/ui/button';
import { appPaths } from '@/config/app-paths';
import type { HomePageResponse, PublicPartnerResponse } from '@/generated/public-home.contract';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

type HomePartnersSectionProps = {
  readonly homePage: HomePageResponse;
  readonly partners: readonly PublicPartnerResponse[];
};

export function HomePartnersSection({ homePage, partners }: HomePartnersSectionProps): ReactElement {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section
      aria-labelledby="home-partners-title"
      className="border-b bg-[linear-gradient(180deg,oklch(0.985_0.004_240)_0%,oklch(0.99_0_0)_100%)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Trusted network
            </p>
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl" id="home-partners-title">
              {homePage.partnersSectionTitle}
            </h2>
            {homePage.partnersSectionDescription ? (
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {homePage.partnersSectionDescription}
              </p>
            ) : null}
          </div>
          <Button asChild className="self-start md:self-auto" variant="outline">
            <Link to={appPaths.partners}>
              View all partners
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
        {partners.length === 0 ? (
          <p role="status">No partners are available yet.</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner, index) => (
              <motion.li
                className="list-none"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                key={partner.id}
                transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : index * 0.04 }}
                viewport={{ once: true, amount: 0.3 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              >
                <article
                  className={cn(
                    'group flex h-full flex-col gap-5 rounded-2xl border border-border/80 bg-background p-5',
                    'shadow-xs transition-[border-color,box-shadow,transform] duration-200',
                    'hover:border-foreground/15 hover:shadow-sm',
                  )}
                >
                  {partner.logoMediaId !== undefined ? (
                    <LogoMediaFrame alt={`${partner.name} logo`} mediaId={partner.logoMediaId} />
                  ) : (
                    <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/40 px-4 text-sm text-muted-foreground">
                      {partner.name}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-medium tracking-tight">{partner.name}</h3>
                      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {partner.shortDescription}
                      </p>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
                      {partner.specialization ? (
                        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          {partner.specialization}
                        </span>
                      ) : null}
                      {partner.country ? (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin aria-hidden="true" className="size-3.5" />
                          {partner.country}
                        </span>
                      ) : null}
                    </div>
                    {partner.websiteUrl ? (
                      <a
                        className={cn(
                          'inline-flex items-center gap-1.5 text-sm font-medium text-foreground',
                          'underline-offset-4 transition-colors hover:underline',
                          focusRingClassName,
                        )}
                        href={partner.websiteUrl}
                        rel="noreferrer noopener"
                        target="_blank"
                      >
                        Visit website
                        <ArrowUpRight aria-hidden="true" className="size-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : null}
                  </div>
                </article>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
