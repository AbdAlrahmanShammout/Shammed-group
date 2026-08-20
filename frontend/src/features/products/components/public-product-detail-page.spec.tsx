import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { appEnv } from '@/config/env';
import { appPaths } from '@/config/app-paths';
import { createQueryClient } from '@/config/query-client';
import { PublicProductDetailPage } from '@/features/products/components/public-product-detail-page';

const mockProduct = {
  product: {
    id: 7,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    name: 'Detail Product',
    shortDescription: 'Short description',
    detailedDescription: 'Detailed description',
    manufacturer: 'Detail Labs',
    isVisible: true,
    displayOrder: 0,
    categoryId: 1,
    category: {
      id: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Pharmaceutical Products',
      isVisible: true,
      displayOrder: 0,
    },
    partner: {
      id: 2,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Detail Partner',
      shortDescription: 'Partner short description',
      websiteUrl: 'https://www.detail-partner.example',
      isVisible: true,
      displayOrder: 0,
    },
  },
};

function renderProductDetail(path: string): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<PublicProductDetailPage />} path={appPaths.productDetail} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PublicProductDetailPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL): Promise<Response> => {
        const url = String(input);
        if (url === `${appEnv.apiBaseUrl}/product/7`) {
          return new Response(JSON.stringify(mockProduct), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (url.startsWith(`${appEnv.apiBaseUrl}/product/`)) {
          return new Response(
            JSON.stringify({
              message: 'Product was not found',
              code: 'NOT_FOUND',
              statusCode: 404,
            }),
            { status: 404, headers: { 'Content-Type': 'application/json' } },
          );
        }
        return new Response('Not found', { status: 404 });
      }),
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it('renders product detail fields and partner link when the API provides them', async () => {
    renderProductDetail('/products/7');
    expect(await screen.findByRole('heading', { name: 'Detail Product' })).toBeInTheDocument();
    expect(screen.getByText('Detailed description')).toBeInTheDocument();
    expect(screen.getByText('Manufacturer: Detail Labs')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Detail Partner' })).toHaveAttribute(
      'href',
      'https://www.detail-partner.example',
    );
  });
  it('shows not-found UX when the product API returns 404', async () => {
    renderProductDetail('/products/999');
    expect(await screen.findByRole('alert')).toHaveTextContent('Product not found.');
    expect(screen.getByRole('link', { name: 'Back to products' })).toHaveAttribute('href', '/products');
  });
  it('omits the partner block when the API product has no partner', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (): Promise<Response> => {
        return new Response(
          JSON.stringify({
            product: {
              ...mockProduct.product,
              partnerId: undefined,
              partner: undefined,
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      }),
    );
    renderProductDetail('/products/7');
    expect(await screen.findByRole('heading', { name: 'Detail Product' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Associated partner' })).not.toBeInTheDocument();
  });
});
