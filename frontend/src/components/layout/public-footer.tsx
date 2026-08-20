import { useState, type ReactElement } from 'react';
import { Link, NavLink } from 'react-router-dom';

import type { PublicNavItem } from '@/components/layout/public-nav-item';
import { PublicMediaImage } from '@/components/media/public-media-image';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

type PublicFooterSocialLink = {
  readonly id: number;
  readonly platform: string;
  readonly url: string;
};

type PublicFooterMapLocation = {
  readonly id: number;
  readonly name: string;
  readonly embedUrl: string;
};

type PublicFooterProps = {
  readonly companyName?: string;
  readonly homePath: string;
  readonly navItems: readonly PublicNavItem[];
  readonly email?: string;
  readonly phone?: string;
  readonly address?: string;
  readonly logoMediaId?: number;
  readonly mapLocations?: readonly PublicFooterMapLocation[];
  readonly socialLinks: readonly PublicFooterSocialLink[];
  readonly copyrightYear: number;
  readonly isSettingsPending?: boolean;
  readonly isSettingsError?: boolean;
};

const footerHeadingClassName = 'flex min-h-9 items-center text-sm font-medium text-foreground';

export function PublicFooter({
  companyName,
  homePath,
  navItems,
  email,
  phone,
  address,
  logoMediaId,
  mapLocations = [],
  socialLinks,
  copyrightYear,
  isSettingsPending = false,
  isSettingsError = false,
}: PublicFooterProps): ReactElement {
  const [selectedLocationId, setSelectedLocationId] = useState<number | undefined>(undefined);
  const activeLocationId = mapLocations.some((location) => location.id === selectedLocationId)
    ? selectedLocationId
    : mapLocations[0]?.id;
  const activeLocation = mapLocations.find((location) => location.id === activeLocationId);
  return (
    <footer className="w-full border-t bg-background">
      <div className="grid w-full grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 md:items-start md:gap-6 lg:gap-8 lg:px-8 xl:px-12">
        <section aria-label="Office locations map" className="flex min-w-0 flex-col gap-3">
          <div className={footerHeadingClassName}>
            {mapLocations.length > 1 ? (
              <div
                aria-label="Choose a location"
                className="flex w-full flex-wrap gap-1.5"
                role="tablist"
              >
                {mapLocations.map((location) => {
                  const isSelected = location.id === activeLocationId;
                  return (
                    <button
                      aria-controls={`footer-map-panel-${location.id}`}
                      aria-selected={isSelected}
                      className={cn(
                        'max-w-full truncate rounded-md border px-2.5 py-1 text-left text-xs transition-colors',
                        focusRingClassName,
                        isSelected
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border bg-background text-muted-foreground hover:text-foreground',
                      )}
                      id={`footer-map-tab-${location.id}`}
                      key={location.id}
                      onClick={() => {
                        setSelectedLocationId(location.id);
                      }}
                      role="tab"
                      title={location.name}
                      type="button"
                    >
                      {location.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <span>{activeLocation?.name ?? 'Map'}</span>
            )}
          </div>
          {mapLocations.length === 0 ? (
            <p className="text-sm text-muted-foreground" role="status">
              Map locations are not available yet.
            </p>
          ) : null}
          {activeLocation ? (
            <div
              aria-labelledby={
                mapLocations.length > 1 ? `footer-map-tab-${activeLocation.id}` : undefined
              }
              className="overflow-hidden rounded-md border bg-muted/30"
              id={`footer-map-panel-${activeLocation.id}`}
              role="tabpanel"
            >
              <iframe
                allowFullScreen
                className="h-40 w-full border-0 sm:h-44"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={activeLocation.embedUrl}
                title={`Google Map for ${activeLocation.name}`}
              />
            </div>
          ) : null}
        </section>
        <div
          aria-label="Contact"
          className="flex min-w-0 flex-col gap-3 text-sm text-muted-foreground"
          role="region"
        >
          <Link
            aria-label={companyName ?? 'Home'}
            className={cn('inline-flex w-fit items-center', focusRingClassName)}
            to={homePath}
          >
            {logoMediaId !== undefined ? (
              <PublicMediaImage
                alt={companyName ? `${companyName} logo` : 'Company logo'}
                className="h-12 w-auto max-w-full object-contain md:h-14"
                mediaId={logoMediaId}
              />
            ) : (
              <span className="text-lg font-medium">{companyName ?? 'Home'}</span>
            )}
          </Link>
          <h2 className={footerHeadingClassName}>Contact</h2>
          {isSettingsPending ? <p role="status">Loading contact details…</p> : null}
          {isSettingsError ? (
            <p role="alert">Contact details are unavailable.</p>
          ) : null}
          {!isSettingsPending && !isSettingsError ? (
            <div className="flex flex-col gap-2">
              {email ? (
                <a
                  className={cn('break-all hover:text-foreground', focusRingClassName)}
                  href={`mailto:${email}`}
                >
                  {email}
                </a>
              ) : null}
              {phone ? (
                <a
                  className={cn('hover:text-foreground', focusRingClassName)}
                  href={`tel:${phone}`}
                >
                  {phone}
                </a>
              ) : null}
              {address ? <p className="leading-relaxed">{address}</p> : null}
            </div>
          ) : null}
          {socialLinks.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {socialLinks.map((socialLink) => (
                <li key={socialLink.id}>
                  <a
                    className={cn('hover:text-foreground', focusRingClassName)}
                    href={socialLink.url}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {socialLink.platform}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <nav aria-label="Footer" className="flex min-w-0 flex-col gap-3">
          <h2 className={footerHeadingClassName}>Navigation</h2>
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      'text-sm text-muted-foreground hover:text-foreground',
                      focusRingClassName,
                      isActive && 'font-medium text-foreground',
                    )
                  }
                  to={item.path}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {companyName ? (
        <p className="w-full border-t px-4 py-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8 xl:px-12">
          © {copyrightYear} {companyName}
        </p>
      ) : null}
    </footer>
  );
}
