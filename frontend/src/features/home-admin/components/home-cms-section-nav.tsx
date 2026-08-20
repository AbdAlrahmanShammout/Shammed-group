import type { ReactElement } from 'react';

import { cn } from '@/lib/utils';

type HomeCmsSectionNavItem = {
  readonly href: string;
  readonly label: string;
};

const HOME_CMS_SECTION_NAV: readonly HomeCmsSectionNavItem[] = [
  { href: '#home-cms-hero', label: 'Hero' },
  { href: '#home-cms-about', label: 'About preview' },
  { href: '#home-cms-catalog', label: 'Catalog titles' },
  { href: '#home-cms-why', label: 'Why Shammed' },
  { href: '#home-cms-contact', label: 'Contact' },
] as const;

/**
 * Side navigation for the Home CMS editor sections.
 */
export function HomeCmsSectionNav(): ReactElement {
  return (
    <nav
      aria-label="Home page sections"
      className="rounded-xl border border-border/80 bg-muted/30 p-3"
    >
      <p className="mb-2 px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Sections
      </p>
      <ul className="flex flex-col gap-1">
        {HOME_CMS_SECTION_NAV.map((item) => (
          <li key={item.href}>
            <a
              className={cn(
                'block rounded-md px-3 py-2 text-sm text-foreground transition-colors',
                'hover:bg-background hover:text-foreground',
                'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
              )}
              href={item.href}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
