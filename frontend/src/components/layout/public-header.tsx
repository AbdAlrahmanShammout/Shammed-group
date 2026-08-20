import { useRef, useState, type ReactElement } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

import type { PublicNavItem } from '@/components/layout/public-nav-item';
import { PublicMediaImage } from '@/components/media/public-media-image';
import { Button } from '@/components/ui/button';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { useMobileNavAccessibility } from '@/lib/a11y/use-mobile-nav-accessibility';
import { cn } from '@/lib/utils';

type PublicHeaderProps = {
  readonly companyName?: string;
  readonly homePath: string;
  readonly isSettingsPending?: boolean;
  readonly logoMediaId?: number;
  readonly navItems: readonly PublicNavItem[];
};

export function PublicHeader({
  companyName,
  homePath,
  isSettingsPending = false,
  logoMediaId,
  navItems,
}: PublicHeaderProps): ReactElement {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  useMobileNavAccessibility({
    isOpen: isMobileMenuOpen,
    menuRef: mobileNavRef,
    onClose: () => setIsMobileMenuOpen(false),
    triggerRef: menuButtonRef,
  });
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          aria-busy={isSettingsPending}
          aria-label={companyName ?? 'Home'}
          className={cn('inline-flex items-center gap-3', focusRingClassName)}
          to={homePath}
        >
          {logoMediaId !== undefined ? (
            <PublicMediaImage
              alt={companyName ? `${companyName} logo` : 'Company logo'}
              className="h-10 w-auto max-w-[11rem] object-contain md:h-11"
              loading="eager"
              mediaId={logoMediaId}
            />
          ) : (
            <span className="text-lg font-medium text-primary-foreground">{companyName ?? 'Home'}</span>
          )}
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      'text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground',
                      focusRingClassName,
                      isActive && 'font-medium text-primary-foreground',
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
        <Button
          aria-controls="mobile-navigation"
          aria-expanded={isMobileMenuOpen}
          className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          ref={menuButtonRef}
          size="icon"
          type="button"
          variant="outline"
        >
          {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
        </Button>
      </div>
      {isMobileMenuOpen ? (
        <nav
          aria-label="Mobile"
          className="border-t border-primary-foreground/15 px-4 py-4 md:hidden"
          id="mobile-navigation"
          ref={mobileNavRef}
        >
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      'text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground',
                      focusRingClassName,
                      isActive && 'font-medium text-primary-foreground',
                    )
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                  to={item.path}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
