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

  it('does not show admin chrome to unsigned callers', () => {
    renderAdminRoute(appPaths.adminHome);
    expect(screen.queryByRole('navigation', { name: 'Admin' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign out' })).not.toBeInTheDocument();
  });

  it('keeps a signed-in caller out of the login page', () => {
    sessionTokenStore.set('input-token');
    renderAdminRoute(appPaths.adminLogin);
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
  });

  it('shows admin chrome to signed-in callers', () => {
    sessionTokenStore.set('input-token');
    renderAdminRoute(appPaths.adminHome);
    expect(screen.getByRole('navigation', { name: 'Admin' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home Page' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Categories' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Partners' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Social Media' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('does not wrap admin routes in the public site chrome', () => {
    renderAdminRoute(appPaths.adminLogin);
    expect(screen.queryByRole('navigation', { name: 'Primary' })).not.toBeInTheDocument();
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });
});
