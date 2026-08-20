import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sessionTokenStore } from '@/api/session-token-store';
import { appEnv } from '@/config/env';
import { createQueryClient } from '@/config/query-client';
import { AdminPartnersPage } from '@/features/partners-admin/components/admin-partners-page';

const mockPartners = {
  partners: [
    {
      id: 3,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Acme Pharma',
      shortDescription: 'Distribution partner',
      isVisible: true,
      displayOrder: 0,
    },
  ],
  total: 1,
};

function renderPage(): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <AdminPartnersPage />
    </QueryClientProvider>,
  );
}

describe('AdminPartnersPage', () => {
  beforeEach(() => {
    sessionTokenStore.set('input-token');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = String(input);
        if (url.startsWith(`${appEnv.apiBaseUrl}/admin/partner`) && (!init || init.method === 'GET')) {
          return new Response(JSON.stringify(mockPartners), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (url === `${appEnv.apiBaseUrl}/admin/partner` && init?.method === 'POST') {
          return new Response(
            JSON.stringify({
              partner: {
                id: 4,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
                name: 'New Partner',
                shortDescription: 'New short description',
                isVisible: false,
                displayOrder: 1,
              },
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } },
          );
        }
        if (url === `${appEnv.apiBaseUrl}/admin/partner/3` && init?.method === 'PATCH') {
          const body = JSON.parse(String(init.body)) as { isVisible?: boolean };
          return new Response(
            JSON.stringify({
              partner: {
                ...mockPartners.partners[0],
                isVisible: body.isVisible ?? false,
              },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        if (url === `${appEnv.apiBaseUrl}/admin/partner/3` && init?.method === 'DELETE') {
          return new Response(JSON.stringify({ message: 'Partner deleted', status: 'ok' }), {
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

  it('creates a partner and can hide visibility on edit', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText('Acme Pharma')).toBeInTheDocument();
    expect(screen.getByText('Drag items to change display order.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Drag to reorder Acme Pharma' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add partner' }));
    await user.type(screen.getByLabelText(/^Name/), 'New Partner');
    await user.type(screen.getByLabelText(/^Short description/), 'New short description');
    await user.click(screen.getByLabelText('Visible on the public site'));
    await user.click(screen.getByRole('button', { name: 'Add partner' }));
    await vi.waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        `${appEnv.apiBaseUrl}/admin/partner`,
        expect.objectContaining({ method: 'POST' }),
      );
    });
    const createCall = vi.mocked(fetch).mock.calls.find((call) => {
      return String(call[0]) === `${appEnv.apiBaseUrl}/admin/partner` && call[1]?.method === 'POST';
    });
    expect(createCall?.[1]?.body).toContain('"isVisible":false');
    expect(createCall?.[1]?.body).toContain('"displayOrder":1');
  });

  it('toggles partner visibility from the list without opening edit', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText('Acme Pharma')).toBeInTheDocument();
    await user.click(screen.getByRole('switch', { name: /Hide Acme Pharma on the public site/i }));
    await vi.waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        `${appEnv.apiBaseUrl}/admin/partner/3`,
        expect.objectContaining({ method: 'PATCH' }),
      );
    });
    const patchCall = vi.mocked(fetch).mock.calls.find((call) => {
      return String(call[0]) === `${appEnv.apiBaseUrl}/admin/partner/3` && call[1]?.method === 'PATCH';
    });
    expect(patchCall?.[1]?.body).toContain('"isVisible":false');
  });

  it('requires confirmation before deleting a partner', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText('Acme Pharma')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Delete/ }));
    const confirmDialog = screen.getByRole('alertdialog');
    expect(screen.getByRole('heading', { name: 'Delete partner?' })).toBeInTheDocument();
    expect(vi.mocked(fetch)).not.toHaveBeenCalledWith(
      `${appEnv.apiBaseUrl}/admin/partner/3`,
      expect.objectContaining({ method: 'DELETE' }),
    );
    await user.click(within(confirmDialog).getByRole('button', { name: /Delete/ }));
    await vi.waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        `${appEnv.apiBaseUrl}/admin/partner/3`,
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });
});
