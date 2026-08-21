import type { ReactElement } from 'react';
import { MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

import { LogoMediaFrame } from '@/components/media/logo-media-frame';
import type { PartnerResponse } from '@/generated/public-partner.contract';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

type PartnerListItemProps = {
  readonly partner: PartnerResponse;
};

type PartnerListItemContentProps = PartnerListItemProps & {
  readonly isInteractive: boolean;
  readonly shouldReduceMotion: boolean | null;
};

function PartnerListItemContent({
  isInteractive,
  partner,
  shouldReduceMotion,
}: PartnerListItemContentProps): ReactElement {
  const shouldAnimateHover = isInteractive && !shouldReduceMotion;
  return (
    <>
      {isInteractive ? (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 rounded-2xl',
            'bg-[radial-gradient(90%_80%_at_0%_0%,oklch(0.62_0.09_255_/_0.14),transparent_55%)]',
            'opacity-0 transition-opacity duration-300 group-hover:opacity-100',
            shouldReduceMotion && 'hidden',
          )}
        />
      ) : null}
      {partner.logoMediaId !== undefined ? (
        <LogoMediaFrame
          alt={`${partner.name} logo`}
          className={cn(
            'relative h-36 w-full self-start md:h-40',
            shouldAnimateHover &&
              'overflow-hidden transition-[border-color,background-color] duration-300 group-hover:border-primary/25 group-hover:bg-muted/40 [&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-out group-hover:[&_img]:scale-[1.06]',
          )}
          mediaId={partner.logoMediaId}
          size="lg"
        />
      ) : (
        <div
          className={cn(
            'relative flex h-36 w-full items-center justify-center self-start rounded-xl border border-dashed border-border/80 bg-muted/40 px-4 text-center text-sm text-muted-foreground md:h-40',
            shouldAnimateHover &&
              'transition-colors duration-300 group-hover:border-primary/25 group-hover:bg-muted/70',
          )}
        >
          {partner.name}
        </div>
      )}
      <div className="relative flex min-w-0 flex-col justify-center gap-4">
        <div className="flex flex-col gap-2">
          <h2
            className={cn(
              'text-2xl font-medium tracking-tight',
              isInteractive && 'transition-colors duration-300 group-hover:text-primary',
            )}
          >
            {partner.name}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{partner.shortDescription}</p>
        </div>
        {partner.fullDescription ? (
          <p className="max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {partner.fullDescription}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {partner.specialization ? (
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {partner.specialization}
            </span>
          ) : null}
          {partner.country ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin aria-hidden="true" className="size-3.5" />
              {partner.country}
            </span>
          ) : null}
        </div>
        {isInteractive ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </div>
    </>
  );
}

export function PartnerListItem({ partner }: PartnerListItemProps): ReactElement {
  const shouldReduceMotion = useReducedMotion();
  const websiteUrl = partner.websiteUrl;
  const isInteractive = Boolean(websiteUrl);
  const cardClassName = cn(
    'group relative grid w-full items-start gap-6 overflow-hidden rounded-2xl border border-border/80 bg-background p-6 text-inherit no-underline md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8 md:p-8',
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
    <PartnerListItemContent
      isInteractive={isInteractive}
      partner={partner}
      shouldReduceMotion={shouldReduceMotion}
    />
  );
  return (
    <motion.li
      className="list-none"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true, amount: 0.25 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
    >
      {!websiteUrl ? (
        <article className={cardClassName}>{cardContent}</article>
      ) : (
        <motion.a
          className={cardClassName}
          href={websiteUrl}
          rel="noreferrer noopener"
          target="_blank"
          transition={
            shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 28 }
          }
          whileHover={shouldReduceMotion ? undefined : { y: -6 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
        >
          {cardContent}
        </motion.a>
      )}
    </motion.li>
  );
}
