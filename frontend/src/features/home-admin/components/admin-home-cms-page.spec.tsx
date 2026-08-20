import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sessionTokenStore } from '@/api/session-token-store';
import { appEnv } from '@/config/env';
import { createQueryClient } from '@/config/query-client';
import { AdminHomeCmsPage } from '@/features/home-admin/components/admin-home-cms-page';

const mockHomePage = {
  homePage: {
    id: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    heroTitle: 'Existing Hero',
    heroDescription: 'Existing description',
    primaryCtaText: 'Learn More',
    primaryCtaUrl: '/about',
    secondaryCtaText: 'Contact',
    secondaryCtaUrl: '/contact',
    aboutPreviewTitle: 'About',
    aboutPreviewDescription: 'About text',
    aboutPreviewCtaText: 'Read more',
    aboutPreviewCtaUrl: '/about',
    partnersSectionTitle: 'Partners',
    productsSectionTitle: 'Products',
    servicesSectionTitle: 'Services',
    whyTitle: 'Why',
    whyDescription: 'Why text',
    contactSectionTitle: 'Contact',
  },
};

function renderPage(): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <AdminHomeCmsPage />
    </QueryClientProvider>,
  );
}

describe('AdminHomeCmsPage', () => {
  beforeEach(() => {
    sessionTokenStore.set('input-token');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = String(input);
        if (url === `${appEnv.apiBaseUrl}/admin/home-page` && (!init || init.method === 'GET')) {
          return new Response(JSON.stringify(mockHomePage), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (url === `${appEnv.apiBaseUrl}/admin/home-page` && init?.method === 'PATCH') {
          return new Response(JSON.stringify(mockHomePage), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (url === `${appEnv.apiBaseUrl}/admin/media` && init?.method === 'POST') {
          return new Response(
            JSON.stringify({
              media: {
                id: 42,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
                originalFileName: 'hero.png',
                mimeType: 'image/png',
                byteSize: 128,
              },
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } },
          );
        }
        return new Response('Not found', { status: 404 });
      }),
    );
  });

  afterEach(() => {
    sessionTokenStore.clear();
    vi.unstubAllGlobals();
  });

  it('saves home page CMS fields without catalog entity editors', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByDisplayValue('Existing Hero')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add partner' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add product' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add service' })).not.toBeInTheDocument();
    expect(
      screen.getByText(/Partner, product, and service lists come from catalog visibility/),
    ).toBeInTheDocument();
    const heroTitleInput = screen.getByDisplayValue('Existing Hero');
    await user.clear(heroTitleInput);
    await user.type(heroTitleInput, 'Updated Hero');
    await user.click(screen.getByRole('button', { name: 'Save home page' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Home page saved successfully.');
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      `${appEnv.apiBaseUrl}/admin/home-page`,
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('uploads a hero image through the media API', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByLabelText('Hero image')).toBeInTheDocument();
    const file = new File(['image-bytes'], 'hero.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText('Hero image'), file);
    expect(await screen.findByText(/Media ID 42/)).toBeInTheDocument();
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      `${appEnv.apiBaseUrl}/admin/media`,
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
