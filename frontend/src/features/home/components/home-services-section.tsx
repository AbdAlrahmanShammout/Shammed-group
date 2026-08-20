import type { ReactElement } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { PublicMediaImage } from '@/components/media/public-media-image';
import { Button } from '@/components/ui/button';
import { appPaths } from '@/config/app-paths';
import type { HomePageResponse, PublicServiceResponse } from '@/generated/public-home.contract';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

type HomeServicesSectionProps = {
  readonly homePage: HomePageResponse;
  readonly services: readonly PublicServiceResponse[];
};

function formatServiceIndex(index: number): string {
  return String(index + 1).padStart(2, '0');
}

type ServiceMediaProps = {
  readonly alt: string;
  readonly className?: string;
  readonly mediaId?: number;
};

function ServiceMedia({ alt, className, mediaId }: ServiceMediaProps): ReactElement {
  if (mediaId === undefined) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-[radial-gradient(circle_at_top,oklch(0.9_0.01_200),oklch(0.95_0_0)_70%)] text-sm text-muted-foreground',
          className,
        )}
      >
        {alt}
      </div>
    );
  }
  return (
    <PublicMediaImage
      alt={alt}
      className={cn('size-full object-cover', className)}
      mediaId={mediaId}
    />
  );
}

export function HomeServicesSection({ homePage, services }: HomeServicesSectionProps): ReactElement {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section
      aria-labelledby="home-services-title"
      className="border-b bg-[linear-gradient(160deg,oklch(0.22_0.02_240)_0%,oklch(0.28_0.025_220)_45%,oklch(0.24_0.02_250)_100%)] text-background"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 md:px-6">
        <div className="flex flex-col gap-6 border-b border-background/15 pb-10 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="text-sm font-medium tracking-[0.2em] text-background/65 uppercase">
              Capabilities
            </p>
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl" id="home-services-title">
              {homePage.servicesSectionTitle}
            </h2>
            {homePage.servicesSectionDescription ? (
              <p className="text-base leading-relaxed text-background/70 md:text-lg">
                {homePage.servicesSectionDescription}
              </p>
            ) : null}
          </div>
          <Button
            asChild
            className="self-start border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background md:self-auto"
            variant="outline"
          >
            <Link to={appPaths.services}>
              View all services
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
        {services.length === 0 ? (
          <p className="text-background/70" role="status">
            No services are available yet.
          </p>
        ) : (
          <ol className="flex flex-col">
            {services.map((service, index) => {
              const isReversed = index % 2 === 1;
              return (
                <motion.li
                  className="list-none border-b border-background/10 last:border-b-0"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                  key={service.id}
                  transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                  viewport={{ once: true, amount: 0.25 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                >
                  <article
                    className={cn(
                      'grid items-center gap-6 py-10 md:grid-cols-2 md:gap-12 md:py-12',
                      isReversed && 'md:[&>*:first-child]:order-2',
                    )}
                  >
                    <div className="relative aspect-[16/11] overflow-hidden md:aspect-[5/4]">
                      <ServiceMedia
                        alt={service.title}
                        className="absolute inset-0 size-full"
                        mediaId={service.imageMediaId}
                      />
                    </div>
                    <div className="flex flex-col gap-4 md:gap-5">
                      <span className="font-mono text-sm tracking-[0.2em] text-background/50">
                        {formatServiceIndex(index)}
                      </span>
                      <h3 className="text-2xl font-medium tracking-tight md:text-3xl">
                        {service.title}
                      </h3>
                      <p className="max-w-md text-base leading-relaxed text-background/70">
                        {service.description}
                      </p>
                      <Link
                        className={cn(
                          'inline-flex w-fit items-center gap-2 text-sm font-medium text-background underline-offset-4 hover:underline',
                          focusRingClassName,
                        )}
                        to={appPaths.services}
                      >
                        Learn more
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </Link>
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
