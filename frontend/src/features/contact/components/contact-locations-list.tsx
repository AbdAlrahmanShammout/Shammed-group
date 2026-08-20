import type { ReactElement } from 'react';

import { createLocationMapsHref } from '@/features/contact/lib/create-location-maps-href';
import type { LocationResponse } from '@/generated/public-contact.contract';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

type ContactLocationsListProps = {
  readonly locations: readonly LocationResponse[];
};

export function ContactLocationsList({ locations }: ContactLocationsListProps): ReactElement {
  if (locations.length === 0) {
    return <p role="status">No branch locations are available yet.</p>;
  }
  return (
    <ul className="flex flex-col gap-8">
      {locations.map((location) => {
        const mapsHref = createLocationMapsHref(location);
        return (
          <li className="flex flex-col gap-2" key={location.id}>
            <h3 className="text-xl font-medium">{location.name}</h3>
            <p className="text-muted-foreground">{location.address}</p>
            {location.phones.length > 0 ? (
              <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                {location.phones.map((phone) => (
                  <li key={phone.id}>
                    <a className={cn('hover:text-foreground', focusRingClassName)} href={`tel:${phone.phone}`}>
                      {phone.phone}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {mapsHref ? (
              <a
                className={cn(
                  'text-sm font-medium underline-offset-4 hover:underline',
                  focusRingClassName,
                )}
                href={mapsHref}
                rel="noreferrer noopener"
                target="_blank"
              >
                Open in Google Maps
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
