import type { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

import type { AdminNavGroup } from '@/components/layout/admin-nav-item';
import { appPaths } from '@/config/app-paths';
import { cn } from '@/lib/utils';

type AdminSidebarProps = {
  readonly navGroups: readonly AdminNavGroup[];
  readonly onNavigate?: () => void;
};

export function AdminSidebar({ navGroups, onNavigate }: AdminSidebarProps): ReactElement {
  return (
    <nav aria-label="Admin" className="flex flex-col gap-6 p-4">
      {navGroups.map((group) => (
        <div className="flex flex-col gap-2" key={group.label}>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {group.label}
          </p>
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => (
              <li key={item.path}>
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isActive && 'bg-accent font-medium text-accent-foreground',
                    )
                  }
                  end={item.path === appPaths.adminHome}
                  onClick={onNavigate}
                  to={item.path}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
