import type { ReactElement } from 'react';

import type { PartnerResponse } from '@/generated/public-partner.contract';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

type PartnerListItemProps = {
  readonly partner: PartnerResponse;
};

export function PartnerListItem({ partner }: PartnerListItemProps): ReactElement {
  return (
    <li className="flex flex-col gap-2 border-b py-8 last:border-b-0">
      <h2 className="text-2xl font-medium">{partner.name}</h2>
      <p className="text-muted-foreground">{partner.shortDescription}</p>
      {partner.fullDescription ? (
        <p className="max-w-3xl whitespace-pre-wrap text-muted-foreground">{partner.fullDescription}</p>
      ) : null}
      {partner.specialization ? (
        <p className="text-sm text-muted-foreground">Specialization: {partner.specialization}</p>
      ) : null}
      {partner.country ? <p className="text-sm text-muted-foreground">Country: {partner.country}</p> : null}
      {partner.websiteUrl ? (
        <a
          className={cn('text-sm font-medium underline-offset-4 hover:underline', focusRingClassName)}
          href={partner.websiteUrl}
          rel="noreferrer noopener"
          target="_blank"
        >
          Visit website
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : null}
    </li>
  );
}
