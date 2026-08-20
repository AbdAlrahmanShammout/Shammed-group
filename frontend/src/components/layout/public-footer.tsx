import type { ReactElement } from 'react';
import { Link, NavLink } from 'react-router-dom';

import type { PublicNavItem } from '@/components/layout/public-nav-item';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

type PublicFooterSocialLink = {
  readonly id: number;
  readonly platform: string;
  readonly url: string;
};

type PublicFooterProps = {
  readonly companyName?: string;
  readonly homePath: string;
  readonly navItems: readonly PublicNavItem[];
  readonly email?: string;
  readonly phone?: string;
  readonly address?: string;
  readonly socialLinks: readonly PublicFooterSocialLink[];
  readonly copyrightYear: number;
  readonly isSettingsPending?: boolean;
  readonly isSettingsError?: boolean;
};

export function PublicFooter({
  companyName,
  homePath,
  navItems,
  email,
  phone,
  address,
  socialLinks,
  copyrightYear,
  isSettingsPending = false,
  isSettingsError = false,
}: PublicFooterProps): ReactElement {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-3 md:px-6">
        <section>
          <Link className={cn('text-lg font-medium', focusRingClassName)} to={homePath}>
            {companyName ?? 'Home'}
          </Link>
        </section>
        <nav aria-label="Footer">
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
        <section aria-label="Contact" className="flex flex-col gap-2 text-sm text-muted-foreground">
          {isSettingsPending ? <p role="status">Loading contact details…</p> : null}
          {isSettingsError ? (
            <p role="alert">Contact details are unavailable.</p>
          ) : null}
          {!isSettingsPending && !isSettingsError ? (
            <>
              {email ? (
                <a className={cn('hover:text-foreground', focusRingClassName)} href={`mailto:${email}`}>
                  {email}
                </a>
              ) : null}
              {phone ? (
                <a className={cn('hover:text-foreground', focusRingClassName)} href={`tel:${phone}`}>
                  {phone}
                </a>
              ) : null}
              {address ? <p>{address}</p> : null}
            </>
          ) : null}
          {socialLinks.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-2">
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
        </section>
      </div>
      {companyName ? (
        <p className="border-t px-4 py-4 text-center text-sm text-muted-foreground md:px-6">
          © {copyrightYear} {companyName}
        </p>
      ) : null}
    </footer>
  );
}
