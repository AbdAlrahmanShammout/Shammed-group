import { motion, useReducedMotion } from 'framer-motion';
import type { ReactElement } from 'react';

import { PublicMediaImage } from '@/components/media/public-media-image';
import type { HomePageResponse } from '@/generated/public-home.contract';

type HomeWhySectionProps = {
  readonly companyName?: string;
  readonly homePage: HomePageResponse;
  readonly logoMediaId?: number;
};

export function HomeWhySection({
  companyName,
  homePage,
  logoMediaId,
}: HomeWhySectionProps): ReactElement {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="home-why-title"
      className="border-b bg-[linear-gradient(180deg,#FFFFFF_0%,#F5F7FA_55%,#FFFFFF_100%)]"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:px-6 md:py-24 lg:grid-cols-[1fr_460px] lg:items-center lg:gap-20">

        {/* ── Left: heading, description, brand reasons ─────────────────── */}
        <motion.div
          className="flex flex-col gap-8"
          initial={shouldReduceMotion ? false : { opacity: 0, x: -18 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.15 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              {homePage.whyEyebrow}
            </p>
            <h2
              className="text-3xl font-medium tracking-tight text-foreground md:text-4xl"
              id="home-why-title"
            >
              {homePage.whyTitle}
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {homePage.whyDescription}
            </p>
          </div>

          <ul className="flex flex-col gap-5" role="list">
            {[
              { title: homePage.whyReason1Title, description: homePage.whyReason1Description },
              { title: homePage.whyReason2Title, description: homePage.whyReason2Description },
              { title: homePage.whyReason3Title, description: homePage.whyReason3Description },
              { title: homePage.whyReason4Title, description: homePage.whyReason4Description },
            ].map((reason, index) => (
              <motion.li
                className="list-none border-l-2 border-primary/30 pl-5"
                initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                key={reason.title}
                transition={{
                  duration: 0.38,
                  delay: shouldReduceMotion ? 0 : 0.18 + index * 0.09,
                  ease: 'easeOut',
                }}
                viewport={{ once: true, amount: 0.4 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              >
                <p className="text-sm font-semibold text-foreground">{reason.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* ── Right: logo showcase panel ─────────────────────────────────── */}
        <motion.div
          className="flex items-center justify-center"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.55, delay: 0.12, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.15 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
        >
          {/*
           * Editorial logo panel — clean architectural framing with:
           * - Soft secondary/blue-tint gradient background
           * - Fine single-pixel rule lines top and bottom
           * - Delicate corner registration marks (four corners)
           * - Company logo as the sole visual anchor
           */}
          <div className="relative flex w-full max-w-sm items-center justify-center overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/50 via-background to-secondary/25 px-12 py-16 lg:max-w-none lg:rounded-[2rem] lg:px-14 lg:py-20">

            {/* Top and bottom rule lines */}
            <div aria-hidden="true" className="absolute inset-x-10 top-7 h-px bg-primary/12" />
            <div aria-hidden="true" className="absolute inset-x-10 bottom-7 h-px bg-primary/12" />

            {/* Corner registration marks — top-left */}
            <div aria-hidden="true" className="absolute left-7 top-7 h-5 w-px bg-primary/25" />
            <div aria-hidden="true" className="absolute left-7 top-7 h-px w-5 bg-primary/25" />
            {/* top-right */}
            <div aria-hidden="true" className="absolute right-7 top-7 h-5 w-px bg-primary/25" />
            <div aria-hidden="true" className="absolute right-7 top-7 h-px w-5 bg-primary/25" />
            {/* bottom-left */}
            <div aria-hidden="true" className="absolute bottom-7 left-7 h-5 w-px bg-primary/25" />
            <div aria-hidden="true" className="absolute bottom-7 left-7 h-px w-5 bg-primary/25" />
            {/* bottom-right */}
            <div aria-hidden="true" className="absolute bottom-7 right-7 h-5 w-px bg-primary/25" />
            <div aria-hidden="true" className="absolute bottom-7 right-7 h-px w-5 bg-primary/25" />

            {/* Logo or text fallback */}
            <div className="relative z-10 flex flex-col items-center gap-5">
              {logoMediaId !== undefined ? (
                <PublicMediaImage
                  alt={companyName ? `${companyName} — official logo` : 'Company logo'}
                  className="h-auto max-h-[180px] w-full max-w-[260px] object-contain md:max-h-[200px] md:max-w-[300px]"
                  loading="eager"
                  mediaId={logoMediaId}
                />
              ) : (
                <span className="text-2xl font-semibold text-primary md:text-3xl">
                  {companyName ?? 'Shammed Group'}
                </span>
              )}

              {/* Subtle attribution line below logo */}
              {companyName ? (
                <p className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-primary/40">
                  {companyName}
                </p>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
