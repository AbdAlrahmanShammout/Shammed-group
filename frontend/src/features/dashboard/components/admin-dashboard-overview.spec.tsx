import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sessionTokenStore } from '@/api/session-token-store';
import { appEnv } from '@/config/env';
import { createQueryClient } from '@/config/query-client';
import { AdminDashboardOverview } from '@/features/dashboard/components/admin-dashboard-overview';

const mockStatistics = {
  statistics: {
    products: { total: 4, visible: 3, hidden: 1 },
    categories: { total: 2, visible: 2, hidden: 0 },
    partners: { total: 5, visible: 4, hidden: 1 },
    services: { total: 0, visible: 0, hidden: 0 },
  },
};

function renderOverview(): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <AdminDashboardOverview accessToken="input-token" />
    </QueryClientProvider>,
  );
}

describe('AdminDashboardOverview', () => {
  beforeEach(() => {
    sessionTokenStore.set('input-token');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL): Promise<Response> => {
        const url = String(input);
        if (url === `${appEnv.apiBaseUrl}/admin/dashboard`) {
          return new Response(JSON.stringify(mockStatistics), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response('Not found', { status: 404 });
      }),
    );
  });

  afterEach(() => {
    sessionTokenStore.clear();
    vi.unstubAllGlobals();
  });

  it('renders catalog counts from the dashboard API without recalculating', async () => {
    renderOverview();
    expect(await screen.findByRole('heading', { name: 'Products' })).toBeInTheDocument();
    const products = screen.getByRole('heading', { name: 'Products' }).closest('section');
    expect(products).not.toBeNull();
    expect(within(products!).getByText('4')).toBeInTheDocument();
    expect(within(products!).getByText('3')).toBeInTheDocument();
    expect(within(products!).getByText('1')).toBeInTheDocument();
    const services = screen.getByRole('heading', { name: 'Services' }).closest('section');
    expect(services).not.toBeNull();
    expect(within(services!).getAllByText('0')).toHaveLength(3);
  });

  it('shows a loading state while statistics are pending', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => undefined)),
    );
    renderOverview();
    expect(screen.getByRole('status')).toHaveTextContent('Loading dashboard statistics…');
  });

  it('shows an error state when the dashboard API fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (): Promise<Response> => {
        return new Response(
          JSON.stringify({
            message: 'Dashboard unavailable',
            code: 'INTERNAL_ERROR',
            statusCode: 500,
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } },
        );
      }),
    );
    renderOverview();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to load dashboard statistics.',
    );
  });
});
