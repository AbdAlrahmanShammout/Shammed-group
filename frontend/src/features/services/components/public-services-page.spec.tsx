import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { appEnv } from '@/config/env';
import { createQueryClient } from '@/config/query-client';
import { PublicServicesPage } from '@/features/services/components/public-services-page';

const mockVisibleServices = {
  services: [
    {
      id: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      title: 'Visible Service',
      description: 'Shown on services page',
      isVisible: true,
      displayOrder: 0,
    },
  ],
  total: 1,
};

function renderPublicServicesPage(): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PublicServicesPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PublicServicesPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL): Promise<Response> => {
        const url = String(input);
        if (url === `${appEnv.apiBaseUrl}/service`) {
          return new Response(JSON.stringify(mockVisibleServices), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response('Not found', { status: 404 });
      }),
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it('renders visible services from the service list API', async () => {
    renderPublicServicesPage();
    expect(await screen.findByRole('heading', { name: 'Services' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Visible Service' })).toBeInTheDocument();
    expect(screen.getByText('Shown on services page')).toBeInTheDocument();
    expect(screen.queryByText('Hidden Service')).not.toBeInTheDocument();
    expect(screen.queryByText('Pharmaceutical Product Distribution')).not.toBeInTheDocument();
  });
  it('does not invent services omitted by the API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (): Promise<Response> => {
        return new Response(JSON.stringify({ services: [], total: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }),
    );
    renderPublicServicesPage();
    expect(await screen.findByText('No services are available yet.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Visible Service' })).not.toBeInTheDocument();
  });
});
