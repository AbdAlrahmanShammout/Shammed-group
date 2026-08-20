import { useEffect, useState, type ReactElement } from 'react';
import { Menu, X } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { Button } from '@/components/ui/button';
import { adminNavGroups } from '@/config/admin-nav-items';

type AdminShellProps = {
  readonly onSignOut: () => void;
};

export function AdminShell({ onSignOut }: AdminShellProps): ReactElement {
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
    <div className="flex min-h-svh bg-background">
      <aside className="hidden w-64 shrink-0 border-r md:block">
        <div className="border-b px-4 py-4">
          <p className="text-lg font-medium">Admin</p>
        </div>
        <AdminSidebar navGroups={adminNavGroups} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b px-4 py-3 md:px-6">
          <Button
            aria-controls="admin-mobile-navigation"
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
          <p className="hidden text-sm text-muted-foreground md:block">Shammed Group CMS</p>
          <Button onClick={onSignOut} type="button" variant="outline">
            Sign out
          </Button>
        </header>
        {isMobileMenuOpen ? (
          <div className="border-b md:hidden" id="admin-mobile-navigation">
            <AdminSidebar
              navGroups={adminNavGroups}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          </div>
        ) : null}
        <main className="flex-1 px-4 py-6 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
