import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/config/query-client';
import { appEnv } from '@/config/env';
import { PublicAboutPage } from '@/features/about/components/public-about-page';

const mockAboutPage = {
  aboutPage: {
    id: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    overview: 'Overview body from API.',
    vision: 'Vision body from API.',
    mission: 'Mission body from API.',
    values: 'Values body from API.',
    capabilities: 'Capabilities body from API.',
  },
};

function renderPublicAboutPage(): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PublicAboutPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PublicAboutPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL): Promise<Response> => {
        const url = String(input);
        if (url === `${appEnv.apiBaseUrl}/about-page`) {
          return new Response(JSON.stringify(mockAboutPage), {
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
  it('renders all five content blocks from the about API', async () => {
    renderPublicAboutPage();
    expect(await screen.findByRole('heading', { name: 'About Us' })).toBeInTheDocument();
    expect(document.title).toBe('About | Shammed Group');
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toContain(
      'vision, mission, values',
    );
    expect(screen.getByRole('heading', { name: 'Company Overview' })).toBeInTheDocument();
    expect(screen.getByText('Overview body from API.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Vision' })).toBeInTheDocument();
    expect(screen.getByText('Vision body from API.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Mission' })).toBeInTheDocument();
    expect(screen.getByText('Mission body from API.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Values' })).toBeInTheDocument();
    expect(screen.getByText('Values body from API.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Capabilities' })).toBeInTheDocument();
    expect(screen.getByText('Capabilities body from API.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'History' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Team' })).not.toBeInTheDocument();
  });
  it('shows an error state when the about API fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (): Promise<Response> => {
        return new Response(
          JSON.stringify({
            message: 'About page was not found',
            code: 'NOT_FOUND',
            statusCode: 404,
          }),
          { status: 404, headers: { 'Content-Type': 'application/json' } },
        );
      }),
    );
    renderPublicAboutPage();
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load the about page.');
  });
});
