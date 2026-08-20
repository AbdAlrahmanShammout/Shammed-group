import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sessionTokenStore } from '@/api/session-token-store';
import { appEnv } from '@/config/env';
import { createQueryClient } from '@/config/query-client';
import { AdminLocationsPage } from '@/features/locations/components/admin-locations-page';

const mockLocations = {
  locations: [
    {
      id: 7,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Damascus office',
      address: 'Mazzeh',
      isVisible: true,
      displayOrder: 0,
      phones: [{ id: 1, phone: '+963', displayOrder: 0 }],
    },
  ],
  total: 1,
};

function renderPage(): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <AdminLocationsPage />
    </QueryClientProvider>,
  );
}

describe('AdminLocationsPage', () => {
  beforeEach(() => {
    sessionTokenStore.set('input-token');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = String(input);
        if (url.startsWith(`${appEnv.apiBaseUrl}/admin/location`) && (!init || init.method === 'GET')) {
          return new Response(JSON.stringify(mockLocations), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (url === `${appEnv.apiBaseUrl}/admin/location/7` && init?.method === 'DELETE') {
          return new Response(JSON.stringify({ message: 'Location deleted', status: 'ok' }), {
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

  it('requires confirmation before deleting a location', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText('Damascus office')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    const confirmDialog = screen.getByRole('alertdialog');
    expect(confirmDialog).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Delete location?' })).toBeInTheDocument();
    expect(vi.mocked(fetch)).not.toHaveBeenCalledWith(
      `${appEnv.apiBaseUrl}/admin/location/7`,
      expect.objectContaining({ method: 'DELETE' }),
    );
    await user.click(within(confirmDialog).getByRole('button', { name: 'Delete' }));
    await vi.waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        `${appEnv.apiBaseUrl}/admin/location/7`,
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });
});
