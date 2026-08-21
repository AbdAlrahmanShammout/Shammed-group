import type { ReactElement } from 'react';

import { ProgressiveImage } from '@/components/media/progressive-image';
import type { ServiceResponse } from '@/generated/public-service.contract';

type ServiceListItemProps = {
  readonly index: number;
  readonly service: ServiceResponse;
};

export function ServiceListItem({ index, service }: ServiceListItemProps): ReactElement {
  const isEven = index % 2 === 0;
  return (
    <li className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div
        className={`flex flex-col md:flex-row ${isEven ? '' : 'md:flex-row-reverse'}`}
      >
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted md:aspect-auto md:w-2/5">
          {service.imageMediaId ? (
            <ProgressiveImage
              alt={service.title}
              className="absolute inset-0 size-full"
              mediaId={service.imageMediaId}
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          ) : (
            <div className="flex h-full min-h-48 w-full items-center justify-center text-muted-foreground">
              <svg
                aria-hidden="true"
                className="h-12 w-12 opacity-25"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3 p-6 md:p-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Service {String(index + 1).padStart(2, '0')}
          </span>
          <h2 className="text-2xl font-semibold leading-snug">{service.title}</h2>
          <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
            {service.description}
          </p>
        </div>
      </div>
    </li>
  );
}
