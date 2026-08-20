import type { ReactElement } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

import { LogoMediaFrame } from '@/components/media/logo-media-frame';
import type { PartnerResponse } from '@/generated/public-partner.contract';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

type PartnerListItemProps = {
  readonly partner: PartnerResponse;
};

export function PartnerListItem({ partner }: PartnerListItemProps): ReactElement {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.li
      className="list-none"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true, amount: 0.25 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
    >
      <article
        className={cn(
          'group grid gap-6 rounded-2xl border border-border/80 bg-background p-6 md:grid-cols-[13rem_1fr] md:gap-8 md:p-8',
          'shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-foreground/15 hover:shadow-sm',
        )}
      >
        {partner.logoMediaId !== undefined ? (
          <LogoMediaFrame
            alt={`${partner.name} logo`}
            className="md:h-full md:min-h-36"
            mediaId={partner.logoMediaId}
            size="lg"
          />
        ) : (
          <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/40 px-4 text-center text-sm text-muted-foreground md:min-h-36">
            {partner.name}
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-medium tracking-tight">{partner.name}</h2>
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
          {partner.websiteUrl ? (
            <a
              className={cn(
                'inline-flex w-fit items-center gap-1.5 text-sm font-medium',
                'underline-offset-4 transition-colors hover:underline',
                focusRingClassName,
              )}
              href={partner.websiteUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              Visit website
              <ArrowUpRight
                aria-hidden="true"
                className="size-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </article>
    </motion.li>
  );
}
