import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { appEnv } from '@/config/env';
import { createQueryClient } from '@/config/query-client';
import { PublicProductsPage } from '@/features/products/components/public-products-page';

const mockCategories = {
  productCategories: [
    {
      id: 10,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Pharmaceutical Products',
      isVisible: true,
      displayOrder: 0,
    },
  ],
  total: 1,
};

const mockPartners = {
  partners: [
    {
      id: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Visible Partner',
      shortDescription: 'Partner',
      isVisible: true,
      displayOrder: 0,
    },
  ],
  total: 1,
};

const mockAllProducts = {
  products: [
    {
      id: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Visible Product',
      shortDescription: 'Shown in catalog',
      manufacturer: 'Visible Labs',
      isVisible: true,
      displayOrder: 0,
      categoryId: 10,
      category: mockCategories.productCategories[0],
      partner: {
        id: 1,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        name: 'Visible Partner',
        shortDescription: 'Partner',
        isVisible: true,
        displayOrder: 0,
      },
    },
  ],
  total: 1,
};

function createProductsFetchMock(): typeof fetch {
  return async (input: RequestInfo | URL): Promise<Response> => {
    const url = String(input);
    if (url === `${appEnv.apiBaseUrl}/product-category`) {
      return new Response(JSON.stringify(mockCategories), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url === `${appEnv.apiBaseUrl}/partner`) {
      return new Response(JSON.stringify(mockPartners), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url.startsWith(`${appEnv.apiBaseUrl}/product`)) {
      if (url.includes('search=stethoscope')) {
        return new Response(JSON.stringify({ products: [], total: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (url.includes('partnerId=1')) {
        return new Response(JSON.stringify(mockAllProducts), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (url.includes('categoryId=10')) {
        return new Response(JSON.stringify(mockAllProducts), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (url.includes('categoryId=')) {
        return new Response(JSON.stringify({ products: [], total: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify(mockAllProducts), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('Not found', { status: 404 });
  };
}

function renderPublicProductsPage(initialEntry = '/products'): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <PublicProductsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PublicProductsPage', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockImplementation(createProductsFetchMock());
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });
  it('loads products and requests the API again when a category filter is selected', async () => {
    const user = userEvent.setup();
    renderPublicProductsPage();
    expect(await screen.findByRole('heading', { name: 'Visible Product' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Pharmaceutical Products' }));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        `${appEnv.apiBaseUrl}/product?categoryId=10&limit=24&offset=0`,
        expect.objectContaining({ method: 'GET' }),
      );
    });
    expect(screen.getByRole('button', { name: 'Pharmaceutical Products' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
  it('shows an empty state when the filtered API response has no products', async () => {
    renderPublicProductsPage('/products?categoryId=99');
    expect(await screen.findByText('No products are available for this selection.')).toBeInTheDocument();
  });
  it('requests the API again when partner and search filters change', async () => {
    const user = userEvent.setup();
    renderPublicProductsPage();
    expect(await screen.findByRole('heading', { name: 'Visible Product' })).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Partner'), '1');
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        `${appEnv.apiBaseUrl}/product?partnerId=1&limit=24&offset=0`,
        expect.objectContaining({ method: 'GET' }),
      );
    });
    await user.type(screen.getByLabelText('Search products'), 'stethoscope');
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('search=stethoscope'),
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });
  it('shows an error state when the products API fails', async () => {
    fetchMock.mockImplementation(async (input: RequestInfo | URL): Promise<Response> => {
      const url = String(input);
      if (url === `${appEnv.apiBaseUrl}/product-category`) {
        return new Response(JSON.stringify(mockCategories), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (url === `${appEnv.apiBaseUrl}/partner`) {
        return new Response(JSON.stringify(mockPartners), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(
        JSON.stringify({
          message: 'Request failed',
          code: 'UNKNOWN_CODE',
          statusCode: 500,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    });
    renderPublicProductsPage();
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load products.');
  });
});
