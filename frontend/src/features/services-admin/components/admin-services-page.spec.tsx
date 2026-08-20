import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sessionTokenStore } from '@/api/session-token-store';
import { appEnv } from '@/config/env';
import { createQueryClient } from '@/config/query-client';
import { AdminServicesPage } from '@/features/services-admin/components/admin-services-page';

const mockServices = {
  services: [
    {
      id: 4,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      title: 'Product Distribution',
      description: 'Regional pharmaceutical distribution.',
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
      <AdminServicesPage />
    </QueryClientProvider>,
  );
}

describe('AdminServicesPage', () => {
  beforeEach(() => {
    sessionTokenStore.set('input-token');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = String(input);
        if (url.startsWith(`${appEnv.apiBaseUrl}/admin/service`) && (!init || init.method === 'GET')) {
          return new Response(JSON.stringify(mockServices), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (url === `${appEnv.apiBaseUrl}/admin/service` && init?.method === 'POST') {
          return new Response(
            JSON.stringify({
              service: {
                id: 5,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
                title: 'Custom Logistics',
                description: 'Custom warehouse coordination.',
                isVisible: false,
                displayOrder: 1,
              },
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } },
          );
        }
        if (url === `${appEnv.apiBaseUrl}/admin/service/4` && init?.method === 'PATCH') {
          const body = JSON.parse(String(init.body)) as { isVisible?: boolean };
          return new Response(
            JSON.stringify({
              service: {
                ...mockServices.services[0],
                isVisible: body.isVisible ?? false,
              },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        if (url === `${appEnv.apiBaseUrl}/admin/service/4` && init?.method === 'DELETE') {
          return new Response(JSON.stringify({ message: 'Service deleted', status: 'ok' }), {
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

  it('creates a free-form service and can hide visibility on edit', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText('Product Distribution')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add service' }));
    expect(screen.queryByRole('option')).toBeNull();
    await user.type(screen.getByLabelText(/^Title/), 'Custom Logistics');
    await user.type(screen.getByLabelText(/^Description/), 'Custom warehouse coordination.');
    await user.click(screen.getByLabelText('Visible on the public site'));
    await user.click(screen.getByRole('button', { name: 'Add service' }));
    await vi.waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        `${appEnv.apiBaseUrl}/admin/service`,
        expect.objectContaining({ method: 'POST' }),
      );
    });
    const createCall = vi.mocked(fetch).mock.calls.find((call) => {
      return String(call[0]) === `${appEnv.apiBaseUrl}/admin/service` && call[1]?.method === 'POST';
    });
    expect(createCall?.[1]?.body).toContain('"title":"Custom Logistics"');
    expect(createCall?.[1]?.body).toContain('"isVisible":false');
    await user.click(screen.getByRole('button', { name: /Edit/ }));
    await user.click(screen.getByLabelText('Visible on the public site'));
    await user.click(screen.getByRole('button', { name: 'Save service' }));
    await vi.waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        `${appEnv.apiBaseUrl}/admin/service/4`,
        expect.objectContaining({ method: 'PATCH' }),
      );
    });
  });

  it('requires confirmation before deleting a service', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText('Product Distribution')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Delete/ }));
    const confirmDialog = screen.getByRole('alertdialog');
    expect(screen.getByRole('heading', { name: 'Delete service?' })).toBeInTheDocument();
    expect(vi.mocked(fetch)).not.toHaveBeenCalledWith(
      `${appEnv.apiBaseUrl}/admin/service/4`,
      expect.objectContaining({ method: 'DELETE' }),
    );
    await user.click(within(confirmDialog).getByRole('button', { name: /Delete/ }));
    await vi.waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        `${appEnv.apiBaseUrl}/admin/service/4`,
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });
});
