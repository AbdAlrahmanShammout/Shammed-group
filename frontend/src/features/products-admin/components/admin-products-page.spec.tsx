import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sessionTokenStore } from '@/api/session-token-store';
import { appEnv } from '@/config/env';
import { createQueryClient } from '@/config/query-client';
import { AdminProductsPage } from '@/features/products-admin/components/admin-products-page';

const mockCategory = {
  id: 2,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  name: 'Diagnostics',
  description: 'Diagnostic products',
  isVisible: true,
  displayOrder: 0,
};

const mockPartner = {
  id: 7,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  name: 'Acme Pharma',
  shortDescription: 'Distribution partner',
  isVisible: true,
  displayOrder: 0,
};

const mockProducts = {
  products: [
    {
      id: 5,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Analyzer Kit',
      shortDescription: 'Lab analyzer kit',
      isVisible: true,
      displayOrder: 0,
      categoryId: 2,
      category: mockCategory,
      partnerId: 7,
      partner: mockPartner,
    },
  ],
  total: 1,
};

function renderPage(): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <AdminProductsPage />
    </QueryClientProvider>,
  );
}

describe('AdminProductsPage', () => {
  beforeEach(() => {
    sessionTokenStore.set('input-token');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = String(input);
        if (url.startsWith(`${appEnv.apiBaseUrl}/admin/product?`) && (!init || init.method === 'GET')) {
          return new Response(JSON.stringify(mockProducts), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (
          url.startsWith(`${appEnv.apiBaseUrl}/admin/product-category`) &&
          (!init || init.method === 'GET')
        ) {
          return new Response(
            JSON.stringify({ productCategories: [mockCategory], total: 1 }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        if (url.startsWith(`${appEnv.apiBaseUrl}/admin/partner`) && (!init || init.method === 'GET')) {
          return new Response(JSON.stringify({ partners: [mockPartner], total: 1 }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (url === `${appEnv.apiBaseUrl}/admin/product` && init?.method === 'POST') {
          return new Response(
            JSON.stringify({
              product: {
                id: 6,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
                name: 'New Product',
                shortDescription: 'New short description',
                isVisible: false,
                displayOrder: 1,
                categoryId: 2,
                category: mockCategory,
              },
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } },
          );
        }
        if (url === `${appEnv.apiBaseUrl}/admin/product/5` && init?.method === 'PATCH') {
          const body = JSON.parse(String(init.body)) as { isVisible?: boolean };
          return new Response(
            JSON.stringify({
              product: {
                ...mockProducts.products[0],
                isVisible: body.isVisible ?? false,
              },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        if (url === `${appEnv.apiBaseUrl}/admin/product/5` && init?.method === 'DELETE') {
          return new Response(JSON.stringify({ message: 'Product deleted', status: 'ok' }), {
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

  it('creates a product with a required category and can hide visibility on edit', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText('Analyzer Kit')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add product' }));
    await user.type(screen.getByLabelText(/^Name/), 'New Product');
    await user.type(screen.getByLabelText(/^Short description/), 'New short description');
    await user.selectOptions(screen.getByLabelText(/^Category/), '2');
    const partnerSelect = screen.getByLabelText(/^Partner/);
    expect(within(partnerSelect).getByRole('option', { name: 'Acme Pharma' })).toBeInTheDocument();
    expect(within(partnerSelect).queryByRole('option', { name: 'Unknown Partner' })).toBeNull();
    await user.click(screen.getByLabelText('Visible on the public site'));
    await user.click(screen.getByRole('button', { name: 'Add product' }));
    await vi.waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        `${appEnv.apiBaseUrl}/admin/product`,
        expect.objectContaining({ method: 'POST' }),
      );
    });
    const createCall = vi.mocked(fetch).mock.calls.find((call) => {
      return String(call[0]) === `${appEnv.apiBaseUrl}/admin/product` && call[1]?.method === 'POST';
    });
    expect(createCall?.[1]?.body).toContain('"categoryId":2');
    expect(createCall?.[1]?.body).toContain('"isVisible":false');
    await user.click(screen.getByRole('button', { name: /Edit/ }));
    await user.click(screen.getByLabelText('Visible on the public site'));
    await user.click(screen.getByRole('button', { name: 'Save product' }));
    await vi.waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        `${appEnv.apiBaseUrl}/admin/product/5`,
        expect.objectContaining({ method: 'PATCH' }),
      );
    });
  });

  it('blocks submit when category is missing', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText('Analyzer Kit')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add product' }));
    await user.type(screen.getByLabelText(/^Name/), 'Incomplete Product');
    await user.type(screen.getByLabelText(/^Short description/), 'Missing category');
    await user.click(screen.getByRole('button', { name: 'Add product' }));
    expect(await screen.findByText('Category is required')).toBeInTheDocument();
    expect(vi.mocked(fetch)).not.toHaveBeenCalledWith(
      `${appEnv.apiBaseUrl}/admin/product`,
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('requires confirmation before deleting a product', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText('Analyzer Kit')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Delete/ }));
    const confirmDialog = screen.getByRole('alertdialog');
    expect(screen.getByRole('heading', { name: 'Delete product?' })).toBeInTheDocument();
    expect(vi.mocked(fetch)).not.toHaveBeenCalledWith(
      `${appEnv.apiBaseUrl}/admin/product/5`,
      expect.objectContaining({ method: 'DELETE' }),
    );
    await user.click(within(confirmDialog).getByRole('button', { name: /Delete/ }));
    await vi.waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        `${appEnv.apiBaseUrl}/admin/product/5`,
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });
});
