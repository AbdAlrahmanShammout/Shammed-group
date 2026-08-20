import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PublicHomePage } from '@/features/home/components/public-home-page';
import { createQueryClient } from '@/config/query-client';
import { appEnv } from '@/config/env';
import { mockPublicHomePage } from '@/test/public-chrome';

function renderPublicHomePage(): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PublicHomePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PublicHomePage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL): Promise<Response> => {
        const url = String(input);
        if (url === `${appEnv.apiBaseUrl}/home-page`) {
          return new Response(JSON.stringify(mockPublicHomePage), {
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
  it('renders CMS sections and visible catalog items with API CTA destinations', async () => {
    renderPublicHomePage();
    expect(await screen.findByRole('heading', { name: mockPublicHomePage.homePage.heroTitle })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn More' })).toHaveAttribute('href', '/about');
    expect(screen.getAllByRole('link', { name: 'Contact Us' }).every((link) => link.getAttribute('href') === '/contact')).toBe(
      true,
    );
    expect(screen.getByRole('link', { name: 'Read more' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('heading', { name: 'Visible Partner' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Visible Product' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Visible Service' })).toBeInTheDocument();
    expect(screen.queryByText('Hidden Partner')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden Product')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden Service')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Visit website/ })).toHaveAttribute(
      'href',
      'https://www.visible-partner.example',
    );
    expect(screen.getByText('Partner: Visible Partner')).toBeInTheDocument();
  });
  it('does not invent catalog rows that the API omitted', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (): Promise<Response> => {
        return new Response(
          JSON.stringify({
            ...mockPublicHomePage,
            partners: [],
            products: [],
            services: [],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      }),
    );
    renderPublicHomePage();
    expect(await screen.findByText('No partners are available yet.')).toBeInTheDocument();
    expect(screen.getByText('No products are available yet.')).toBeInTheDocument();
    expect(screen.getByText('No services are available yet.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Visible Partner' })).not.toBeInTheDocument();
  });
});
