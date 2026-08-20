import { useEffect, useState, type ReactElement } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

import type { PublicNavItem } from '@/components/layout/public-nav-item';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PublicHeaderProps = {
  readonly companyName?: string;
  readonly homePath: string;
  readonly isSettingsPending?: boolean;
  readonly navItems: readonly PublicNavItem[];
};

export function PublicHeader({
  companyName,
  homePath,
  isSettingsPending = false,
  navItems,
}: PublicHeaderProps): ReactElement {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link aria-busy={isSettingsPending} className="text-lg font-medium" to={homePath}>
          {companyName ?? 'Home'}
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      'text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
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
        <Button
          aria-controls="mobile-navigation"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          size="icon"
          type="button"
          variant="outline"
        >
          {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
        </Button>
      </div>
      {isMobileMenuOpen ? (
        <nav aria-label="Mobile" className="border-t px-4 py-4 md:hidden" id="mobile-navigation">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      'text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isActive && 'font-medium text-foreground',
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
