import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sessionTokenStore } from '@/api/session-token-store';
import { appEnv } from '@/config/env';
import { createQueryClient } from '@/config/query-client';
import { AdminCategoriesPage } from '@/features/categories/components/admin-categories-page';

const mockCategories = {
  productCategories: [
    {
      id: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Medicines',
      isVisible: true,
      displayOrder: 0,
    },
    {
      id: 2,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Devices',
      isVisible: true,
      displayOrder: 1,
    },
  ],
  total: 2,
};

function renderPage(): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <AdminCategoriesPage />
    </QueryClientProvider>,
  );
}

describe('AdminCategoriesPage', () => {
  beforeEach(() => {
    sessionTokenStore.set('input-token');
  });

  afterEach(() => {
    sessionTokenStore.clear();
    vi.unstubAllGlobals();
  });

  it('shows a replacement picker when deleting an occupied category', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = String(input);
        if (
          url.startsWith(`${appEnv.apiBaseUrl}/admin/product-category`) &&
          (!init || init.method === 'GET')
        ) {
          return new Response(JSON.stringify(mockCategories), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (url === `${appEnv.apiBaseUrl}/admin/product-category/1` && init?.method === 'DELETE') {
          return new Response(
            JSON.stringify({
              message:
                'ProductCategory cannot be deleted. Current status: contains products. Expected status: empty, or a replacement category.',
              code: 'PRODUCT_CATEGORY_OCCUPIED',
              statusCode: 400,
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          );
        }
        if (
          url === `${appEnv.apiBaseUrl}/admin/product-category/1?replacementCategoryId=2` &&
          init?.method === 'DELETE'
        ) {
          return new Response(
            JSON.stringify({ message: 'Product category deleted', status: 'ok' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        return new Response('Not found', { status: 404 });
      }),
    );
    renderPage();
    expect(await screen.findByText('Medicines')).toBeInTheDocument();
    const medicinesRow = screen.getByText('Medicines').closest('li');
    expect(medicinesRow).not.toBeNull();
    await user.click(within(medicinesRow!).getByRole('button', { name: /Delete/ }));
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: /Delete/ }));
    expect(
      await screen.findByRole('heading', { name: 'Move products before deleting' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Replacement category')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Replacement category'), '2');
    await user.click(screen.getByRole('button', { name: 'Reassign and delete' }));
    await vi.waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        `${appEnv.apiBaseUrl}/admin/product-category/1?replacementCategoryId=2`,
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  it('shows the API error when the last occupied category cannot be deleted', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = String(input);
        if (
          url.startsWith(`${appEnv.apiBaseUrl}/admin/product-category`) &&
          (!init || init.method === 'GET')
        ) {
          return new Response(
            JSON.stringify({
              productCategories: [mockCategories.productCategories[0]],
              total: 1,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        if (url === `${appEnv.apiBaseUrl}/admin/product-category/1` && init?.method === 'DELETE') {
          return new Response(
            JSON.stringify({
              message:
                'ProductCategory cannot be deleted. Current status: only category with products. Expected status: another category available to receive products.',
              code: 'PRODUCT_CATEGORY_LAST_OCCUPIED',
              statusCode: 400,
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          );
        }
        return new Response('Not found', { status: 404 });
      }),
    );
    renderPage();
    expect(await screen.findByText('Medicines')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Delete/ }));
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: /Delete/ }));
    expect(
      await screen.findByText(/only category with products/),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('Replacement category')).not.toBeInTheDocument();
  });
});
