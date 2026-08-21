import type { ReactElement } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
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

type HomePartnerCardProps = {
  readonly partner: PublicPartnerResponse;
  readonly shouldReduceMotion: boolean | null;
};

type HomePartnerCardContentProps = HomePartnerCardProps & {
  readonly isInteractive: boolean;
};

function HomePartnerCardContent({
  isInteractive,
  partner,
  shouldReduceMotion,
}: HomePartnerCardContentProps): ReactElement {
  const shouldAnimateHover = isInteractive && !shouldReduceMotion;
  return (
    <>
      {isInteractive ? (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 rounded-2xl',
            'bg-[radial-gradient(120%_70%_at_50%_-10%,oklch(0.62_0.09_255_/_0.16),transparent_58%)]',
            'opacity-0 transition-opacity duration-300 group-hover:opacity-100',
            shouldReduceMotion && 'hidden',
          )}
        />
      ) : null}
      <div className="relative flex h-full flex-col gap-5">
        {partner.logoMediaId !== undefined ? (
          <LogoMediaFrame
            alt={`${partner.name} logo`}
            className={cn(
              shouldAnimateHover &&
                'overflow-hidden transition-[border-color,background-color] duration-300 group-hover:border-primary/25 group-hover:bg-muted/40 [&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-out group-hover:[&_img]:scale-[1.06]',
            )}
            mediaId={partner.logoMediaId}
          />
        ) : (
          <div
            className={cn(
              'flex h-28 items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/40 px-4 text-sm text-muted-foreground',
              shouldAnimateHover &&
                'transition-colors duration-300 group-hover:border-primary/25 group-hover:bg-muted/70',
            )}
          >
            {partner.name}
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col gap-2">
            <h3
              className={cn(
                'text-lg font-medium tracking-tight',
                isInteractive && 'transition-colors duration-300 group-hover:text-primary',
              )}
            >
              {partner.name}
            </h3>
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
          {isInteractive ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </div>
      </div>
    </>
  );
}

function HomePartnerCard({ partner, shouldReduceMotion }: HomePartnerCardProps): ReactElement {
  const websiteUrl = partner.websiteUrl;
  const isInteractive = Boolean(websiteUrl);
  const cardClassName = cn(
    'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-background p-5 text-inherit no-underline',
    'shadow-xs',
    isInteractive &&
      cn(
        'transition-[border-color,box-shadow] duration-300',
        'hover:border-primary/25 hover:shadow-[0_18px_40px_-24px_oklch(0.32_0.06_260_/_0.55)]',
        focusRingClassName,
        shouldReduceMotion && 'transition-none hover:border-border/80 hover:shadow-xs',
      ),
  );
  const cardContent = (
    <HomePartnerCardContent
      isInteractive={isInteractive}
      partner={partner}
      shouldReduceMotion={shouldReduceMotion}
    />
  );
  if (!websiteUrl) {
    return <article className={cardClassName}>{cardContent}</article>;
  }
  return (
    <motion.a
      className={cardClassName}
      href={websiteUrl}
      rel="noreferrer noopener"
      target="_blank"
      transition={
        shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 28 }
      }
      whileHover={shouldReduceMotion ? undefined : { y: -8 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
    >
      {cardContent}
    </motion.a>
  );
}

export function HomePartnersSection({ homePage, partners }: HomePartnersSectionProps): ReactElement {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section
      aria-labelledby="home-partners-title"
      className="border-b bg-[linear-gradient(180deg,#F5F7FA_0%,#FFFFFF_100%)]"
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
                <HomePartnerCard partner={partner} shouldReduceMotion={shouldReduceMotion} />
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
