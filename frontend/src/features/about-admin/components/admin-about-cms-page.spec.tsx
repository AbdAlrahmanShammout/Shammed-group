import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sessionTokenStore } from '@/api/session-token-store';
import { appEnv } from '@/config/env';
import { createQueryClient } from '@/config/query-client';
import { AdminAboutCmsPage } from '@/features/about-admin/components/admin-about-cms-page';

const mockAboutPage = {
  aboutPage: {
    id: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    overview: 'Existing overview',
    vision: 'Existing vision',
    mission: 'Existing mission',
    values: 'Existing values as free-form text',
    capabilities: 'Existing capabilities',
  },
};

function renderPage(): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <AdminAboutCmsPage />
    </QueryClientProvider>,
  );
}

describe('AdminAboutCmsPage', () => {
  beforeEach(() => {
    sessionTokenStore.set('input-token');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = String(input);
        if (url === `${appEnv.apiBaseUrl}/admin/about-page` && (!init || init.method === 'GET')) {
          return new Response(JSON.stringify(mockAboutPage), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (url === `${appEnv.apiBaseUrl}/admin/about-page` && init?.method === 'PATCH') {
          const body = JSON.parse(String(init.body)) as { values?: unknown };
          expect(typeof body.values).toBe('string');
          expect(Array.isArray(body.values)).toBe(false);
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
    sessionTokenStore.clear();
    vi.unstubAllGlobals();
  });

  it('saves free-form about fields without value-record editors', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByDisplayValue('Existing overview')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing values as free-form text')).toBeInTheDocument();
    expect(
      screen.getByText(/Values is a single content field, not a list of separate records/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add value' })).not.toBeInTheDocument();
    const overview = screen.getByDisplayValue('Existing overview');
    await user.clear(overview);
    await user.type(overview, 'Updated overview');
    await user.click(screen.getByRole('button', { name: 'Save about page' }));
    expect(await screen.findByRole('status')).toHaveTextContent('About page saved successfully.');
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      `${appEnv.apiBaseUrl}/admin/about-page`,
      expect.objectContaining({ method: 'PATCH' }),
    );
  });
});
