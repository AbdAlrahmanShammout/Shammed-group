import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sessionTokenStore } from '@/api/session-token-store';
import { AppRoutes } from '@/app/app-routes';
import { AuthSessionProvider } from '@/app/auth-session-provider';
import { appPaths } from '@/config/app-paths';
import { createQueryClient } from '@/config/query-client';

function renderAdminRoute(path: string): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <AuthSessionProvider>
          <AppRoutes />
        </AuthSessionProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('admin session routes', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: 1, role: 'admin' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
  });

  afterEach(() => {
    sessionTokenStore.clear();
    vi.unstubAllGlobals();
  });

  it('redirects unsigned callers from admin routes to login', () => {
    renderAdminRoute(appPaths.adminHome);
    expect(screen.getByRole('heading', { name: 'Admin sign in' })).toBeInTheDocument();
  });

  it('keeps a signed-in caller out of the login page', () => {
    sessionTokenStore.set('input-token');
    renderAdminRoute(appPaths.adminLogin);
    expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument();
  });

  it('does not wrap admin routes in the public site chrome', () => {
    renderAdminRoute(appPaths.adminLogin);
    expect(screen.queryByRole('navigation', { name: 'Primary' })).not.toBeInTheDocument();
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });
});
