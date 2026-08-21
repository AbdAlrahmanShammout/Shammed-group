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
        if (url === `${appEnv.apiBaseUrl}/site-settings`) {
          return new Response(
            JSON.stringify({
              siteSettings: {
                id: 1,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
                companyName: 'Example Company',
                companyNameEnglish: 'Example Company',
                email: 'contact@example.test',
                phone: '+10000000000',
                address: '1 Example Street',
              },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
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
    expect(screen.getByRole('img', { name: 'Visible Partner logo' })).toHaveAttribute(
      'src',
      `${appEnv.apiBaseUrl}/media/31`,
    );
    const partnerWebsiteLink = screen.getByRole('heading', { name: 'Visible Partner' }).closest('a');
    expect(partnerWebsiteLink).toHaveAttribute('href', 'https://www.visible-partner.example');
    expect(partnerWebsiteLink).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('heading', { name: 'Visible Product' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Visible Product' })).toHaveAttribute(
      'src',
      `${appEnv.apiBaseUrl}/media/42`,
    );
    expect(screen.getByRole('link', { name: /Visible Product/ })).toHaveAttribute(
      'href',
      '/products/1',
    );
    expect(screen.getByRole('link', { name: /Visible Product/ })).toHaveTextContent('Visible Partner');
    expect(screen.getByRole('heading', { name: 'Visible Service' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Visible Service' })).toHaveAttribute(
      'src',
      `${appEnv.apiBaseUrl}/media/28`,
    );
    expect(screen.queryByText('Hidden Partner')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden Product')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden Service')).not.toBeInTheDocument();
    const heroImage = document.querySelector(
      `img[src="${appEnv.apiBaseUrl}/media/${mockPublicHomePage.homePage.heroImageMediaId}"]`,
    );
    expect(heroImage).toBeInTheDocument();
    expect(screen.getByRole('img', { name: mockPublicHomePage.homePage.aboutPreviewTitle })).toHaveAttribute(
      'src',
      `${appEnv.apiBaseUrl}/media/${mockPublicHomePage.homePage.aboutPreviewImageMediaId}`,
    );
    expect(screen.getByRole('heading', { name: mockPublicHomePage.homePage.contactSectionTitle })).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View locations/ })).toHaveAttribute('href', '/contact');
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
