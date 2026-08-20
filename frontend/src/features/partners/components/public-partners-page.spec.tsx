import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { appEnv } from '@/config/env';
import { createQueryClient } from '@/config/query-client';
import { PublicPartnersPage } from '@/features/partners/components/public-partners-page';

const mockVisiblePartners = {
  partners: [
    {
      id: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Visible Partner',
      shortDescription: 'Shown on partners page',
      specialization: 'Oncology',
      websiteUrl: 'https://www.visible-partner.example',
      country: 'Germany',
      isVisible: true,
      displayOrder: 0,
    },
  ],
  total: 1,
};

function renderPublicPartnersPage(): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PublicPartnersPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PublicPartnersPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL): Promise<Response> => {
        const url = String(input);
        if (url === `${appEnv.apiBaseUrl}/partner`) {
          return new Response(JSON.stringify(mockVisiblePartners), {
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
  it('renders visible partners from the partner list API', async () => {
    renderPublicPartnersPage();
    expect(await screen.findByRole('heading', { name: 'Partners' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Visible Partner' })).toBeInTheDocument();
    expect(screen.getByText('Shown on partners page')).toBeInTheDocument();
    expect(screen.getByText('Specialization: Oncology')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Visit website/ })).toHaveAttribute(
      'href',
      'https://www.visible-partner.example',
    );
    expect(screen.queryByText('Hidden Partner')).not.toBeInTheDocument();
  });
  it('does not invent partners omitted by the API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (): Promise<Response> => {
        return new Response(JSON.stringify({ partners: [], total: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }),
    );
    renderPublicPartnersPage();
    expect(await screen.findByText('No partners are available yet.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Visible Partner' })).not.toBeInTheDocument();
  });
});
