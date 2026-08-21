import { useState, type ReactElement } from 'react';
import { Link, NavLink } from 'react-router-dom';

import type { PublicNavItem } from '@/components/layout/public-nav-item';
import { PublicMediaImage } from '@/components/media/public-media-image';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { findSocialPlatform } from '@/lib/social-platforms';
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

const footerHeadingClassName = 'flex min-h-9 items-center text-xs font-semibold uppercase tracking-wider text-white';

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
    <footer className="w-full bg-[#0B0F1E] text-slate-400">
      <div aria-hidden="true" className="h-[3px] bg-gradient-to-r from-primary via-primary/60 to-transparent" />
      <div className="grid w-full grid-cols-1 gap-6 px-4 py-10 sm:px-6 md:grid-cols-3 md:items-start md:gap-8 lg:gap-10 lg:px-8 xl:px-12">
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
                          ? 'border-primary/60 bg-primary/25 text-white'
                          : 'border-white/20 bg-white/8 text-slate-300 hover:border-white/30 hover:bg-white/12 hover:text-white',
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
            <p className="text-sm text-slate-500" role="status">
              Map locations are not available yet.
            </p>
          ) : null}
          {activeLocation ? (
            <div
              aria-labelledby={
                mapLocations.length > 1 ? `footer-map-tab-${activeLocation.id}` : undefined
              }
              className="overflow-hidden rounded-md border border-white/10 bg-white/5"
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
          className="flex min-w-0 flex-col gap-3 text-sm text-slate-400"
          role="region"
        >
          <Link
            aria-label={companyName ?? 'Home'}
            className={cn('inline-flex w-fit items-center', focusRingClassName)}
            to={homePath}
          >
            {logoMediaId !== undefined ? (
              <span className="inline-flex items-center rounded-xl bg-white px-4 py-3 shadow-lg">
                <PublicMediaImage
                  alt={companyName ? `${companyName} logo` : 'Company logo'}
                  className="h-14 w-auto max-w-[13rem] object-contain md:h-16"
                  mediaId={logoMediaId}
                />
              </span>
            ) : (
              <span className="text-xl font-bold text-white">{companyName ?? 'Home'}</span>
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
                  className={cn('break-all transition-colors hover:text-white', focusRingClassName)}
                  href={`mailto:${email}`}
                >
                  {email}
                </a>
              ) : null}
              {phone ? (
                <a
                  className={cn('transition-colors hover:text-white', focusRingClassName)}
                  href={`tel:${phone}`}
                >
                  {phone}
                </a>
              ) : null}
              {address ? <p className="leading-relaxed">{address}</p> : null}
            </div>
          ) : null}
          {socialLinks.length > 0 ? (
            <ul className="flex flex-wrap gap-3 pt-1">
              {socialLinks.map((socialLink) => {
                const platform = findSocialPlatform(socialLink.platform);
                const platformLabel = platform?.label ?? socialLink.platform;
                return (
                  <li key={socialLink.id}>
                    <a
                      aria-label={`${platformLabel} (opens in a new tab)`}
                  className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/5 text-slate-400 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white',
                      focusRingClassName,
                    )}
                      href={socialLink.url}
                      rel="noreferrer noopener"
                      target="_blank"
                      title={platformLabel}
                    >
                      {platform ? (
                        platform.icon({ className: 'h-4 w-4' })
                      ) : (
                        <span className="text-xs font-medium">{socialLink.platform.slice(0, 2).toUpperCase()}</span>
                      )}
                    </a>
                  </li>
                );
              })}
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
                      'text-sm transition-colors hover:text-white',
                      focusRingClassName,
                      isActive ? 'font-medium text-white' : 'text-slate-400',
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
        <p className="w-full border-t border-white/10 px-4 py-4 text-center text-sm text-slate-600 sm:px-6 lg:px-8 xl:px-12">
          © {copyrightYear} {companyName}
        </p>
      ) : null}
    </footer>
  );
}
