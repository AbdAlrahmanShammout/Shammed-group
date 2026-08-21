import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactElement } from 'react';

import { ProgressiveImage } from '@/components/media/progressive-image';
import { HomeCtaLink } from '@/features/home/components/home-cta-link';
import type { HomePageResponse } from '@/generated/public-home.contract';
import { cn } from '@/lib/utils';

type HomeAboutPreviewSectionProps = {
  readonly homePage: HomePageResponse;
};

/**
 * Decorative fallback shown in the image slot when no aboutPreviewImage is set.
 * Uses brand colours and geometric forms consistent with the hero visual.
 */
function AboutImageFallback(): ReactElement {
  return (
    <div
      className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl"
      style={{ background: 'linear-gradient(140deg, #E8ECF7 0%, #F0F7FF 60%, #DFF7F0 100%)' }}
    >
      {/* Soft blobs */}
      <div className="pointer-events-none absolute"
        style={{ top: '10%', right: '-5%', width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(130,217,210,0.30) 0%, transparent 70%)',
          filter: 'blur(28px)' }} />
      <div className="pointer-events-none absolute"
        style={{ bottom: '15%', left: '-5%', width: 160, height: 160, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110,136,232,0.22) 0%, transparent 70%)',
          filter: 'blur(24px)' }} />
      {/* Centre ring */}
      <div className="absolute h-40 w-40 rounded-full"
        style={{ border: '1px solid rgba(110,136,232,0.18)' }} />
      <div className="absolute h-24 w-24 rounded-full"
        style={{ border: '1px dashed rgba(130,217,210,0.28)' }} />
      {/* Centre mark */}
      <div className="absolute h-2.5 w-2.5 rounded-full"
        style={{ background: '#6E88E8', opacity: 0.55 }} />
      {/* Floating label */}
      <div className="absolute bottom-8 right-8 text-right">
        <p className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: 'rgba(44,52,112,0.45)' }}>
          Shammed Group
        </p>
      </div>
    </div>
  );
}

export function HomeAboutPreviewSection({ homePage }: HomeAboutPreviewSectionProps): ReactElement {
  const shouldReduceMotion = useReducedMotion();
  const hasImage = homePage.aboutPreviewImageMediaId !== undefined;

  return (
    <section
      aria-labelledby="home-about-title"
      className="border-b bg-white"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:px-6 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-20">

        {/* ── Image column — below text on mobile, left on desktop ─────── */}
        <motion.div
          className="order-last lg:order-first"
          initial={shouldReduceMotion ? false : { opacity: 0, x: -18 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
        >
          {hasImage ? (
            <div className="relative">
              {/* Offset decorative layer behind the image */}
              <div
                aria-hidden="true"
                className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #E8ECF7 0%, #DFF7F0 100%)', opacity: 0.55 }}
              />
              <ProgressiveImage
                alt={homePage.aboutPreviewTitle}
                className="relative aspect-[4/5] w-full rounded-2xl"
                loading="eager"
                mediaId={homePage.aboutPreviewImageMediaId!}
                sizes="(max-width: 768px) 100vw, 50vw"
                srcWidths={[600, 900, 1200]}
              />
            </div>
          ) : (
            <AboutImageFallback />
          )}
        </motion.div>

        {/* ── Text column — first on mobile, right on desktop ──────────── */}
        <motion.div
          className="order-first flex flex-col gap-7 lg:order-last"
          initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
          viewport={{ once: true, amount: 0.2 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5">
            <div className="h-px w-7 shrink-0 bg-primary/40" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/60">
              {homePage.aboutEyebrow}
            </p>
          </div>

          {/* Heading */}
          <h2
            className="text-3xl font-medium tracking-tight text-foreground md:text-4xl"
            id="home-about-title"
          >
            {homePage.aboutPreviewTitle}
          </h2>

          {/* Body */}
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {homePage.aboutPreviewDescription}
          </p>

          {/* Brand metrics */}
          <div className="grid grid-cols-3 gap-4 border-t border-border/60 pt-6">
            {[
              { value: homePage.aboutMetric1Value, label: homePage.aboutMetric1Label },
              { value: homePage.aboutMetric2Value, label: homePage.aboutMetric2Label },
              { value: homePage.aboutMetric3Value, label: homePage.aboutMetric3Label },
            ].map((metric, index) => (
              <motion.div
                className={cn(
                  'flex flex-col gap-1',
                  index > 0 && 'border-l border-border/50 pl-4',
                )}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                key={metric.value}
                transition={{
                  duration: 0.35,
                  delay: shouldReduceMotion ? 0 : 0.2 + index * 0.07,
                  ease: 'easeOut',
                }}
                viewport={{ once: true, amount: 0.5 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              >
                <span className="text-2xl font-semibold tracking-tight text-primary">
                  {metric.value}
                </span>
                <span className="text-xs leading-snug text-muted-foreground">
                  {metric.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-1">
            <HomeCtaLink href={homePage.aboutPreviewCtaUrl} variant="outline">
              {homePage.aboutPreviewCtaText}
              <ArrowRight aria-hidden="true" className="size-4" />
            </HomeCtaLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
