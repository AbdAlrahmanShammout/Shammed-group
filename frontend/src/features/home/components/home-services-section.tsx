import type { ReactElement } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { PublicMediaImage } from '@/components/media/public-media-image';
import { Button } from '@/components/ui/button';
import { appPaths } from '@/config/app-paths';
import type { HomePageResponse, PublicServiceResponse } from '@/generated/public-home.contract';
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
          'flex items-center justify-center bg-[radial-gradient(circle_at_top,oklch(0.94_0.01_240),oklch(0.97_0_0)_70%)] text-sm text-muted-foreground',
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
      className={cn(
        'size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]',
        className,
      )}
      mediaId={mediaId}
    />
  );
}

export function HomeServicesSection({ homePage, services }: HomeServicesSectionProps): ReactElement {
  const shouldReduceMotion = useReducedMotion();
  const [featuredService, ...remainingServices] = services;
  return (
    <section aria-labelledby="home-services-title" className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              What we deliver
            </p>
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl" id="home-services-title">
              {homePage.servicesSectionTitle}
            </h2>
            {homePage.servicesSectionDescription ? (
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {homePage.servicesSectionDescription}
              </p>
            ) : null}
          </div>
          <Button asChild className="self-start md:self-auto" variant="outline">
            <Link to={appPaths.services}>
              View all services
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
        {services.length === 0 ? (
          <p role="status">No services are available yet.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {featuredService ? (
              <motion.article
                className={cn(
                  'group grid overflow-hidden rounded-3xl border border-border/80 bg-background shadow-xs',
                  'md:grid-cols-[1.15fr_1fr]',
                  'transition-[border-color,box-shadow] duration-200 hover:border-foreground/15 hover:shadow-sm',
                )}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true, amount: 0.25 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              >
                <div className="relative min-h-64 overflow-hidden md:min-h-[22rem]">
                  <ServiceMedia
                    alt={featuredService.title}
                    className="absolute inset-0"
                    mediaId={featuredService.imageMediaId}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/25 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-background/10" />
                </div>
                <div className="flex flex-col justify-center gap-5 p-6 md:p-10">
                  <span className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    {formatServiceIndex(0)}
                  </span>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-medium tracking-tight md:text-3xl">
                      {featuredService.title}
                    </h3>
                    <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                      {featuredService.description}
                    </p>
                  </div>
                  <Link
                    className="inline-flex w-fit items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
                    to={appPaths.services}
                  >
                    Explore services
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </motion.article>
            ) : null}
            {remainingServices.length > 0 ? (
              <ul className="grid gap-5 md:grid-cols-2">
                {remainingServices.map((service, index) => (
                  <motion.li
                    className="list-none"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    key={service.id}
                    transition={{
                      duration: 0.35,
                      delay: shouldReduceMotion ? 0 : (index + 1) * 0.05,
                    }}
                    viewport={{ once: true, amount: 0.25 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  >
                    <article
                      className={cn(
                        'group flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-background',
                        'shadow-xs transition-[border-color,box-shadow] duration-200',
                        'hover:border-foreground/15 hover:shadow-sm',
                      )}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <ServiceMedia
                          alt={service.title}
                          className="absolute inset-0"
                          mediaId={service.imageMediaId}
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/35 to-transparent" />
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
                        <span className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                          {formatServiceIndex(index + 1)}
                        </span>
                        <h3 className="text-xl font-medium tracking-tight">{service.title}</h3>
                        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </article>
                  </motion.li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
