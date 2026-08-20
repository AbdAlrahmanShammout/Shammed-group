import { useRef, useState, type ReactElement } from 'react';
import { Menu, X } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { Button } from '@/components/ui/button';
import { adminNavGroups } from '@/config/admin-nav-items';
import { useMobileNavAccessibility } from '@/lib/a11y/use-mobile-nav-accessibility';

type AdminShellProps = {
  readonly onSignOut: () => void;
};

export function AdminShell({ onSignOut }: AdminShellProps): ReactElement {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  useMobileNavAccessibility({
    isOpen: isMobileMenuOpen,
    menuRef: mobileNavRef,
    onClose: () => setIsMobileMenuOpen(false),
    triggerRef: menuButtonRef,
  });
  return (
    <div className="flex min-h-svh bg-background">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
        href="#admin-main-content"
      >
        Skip to content
      </a>
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
            ref={menuButtonRef}
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
          <div className="border-b md:hidden" id="admin-mobile-navigation" ref={mobileNavRef}>
            <AdminSidebar
              navGroups={adminNavGroups}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          </div>
        ) : null}
        <main className="flex-1 px-4 py-6 md:px-6" id="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
