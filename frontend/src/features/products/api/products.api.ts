import { requestApi } from '@/api/http-client';
import type {
  GetPublicProductsQuery,
  GetProductsResponseDto,
  ProductResponseDto,
} from '@/generated/public-product.contract';

const PRODUCTS_PATH = '/product';

function createProductsPath(query: GetPublicProductsQuery = {}): string {
  const searchParams = new URLSearchParams();
  if (query.categoryId !== undefined) {
    searchParams.set('categoryId', String(query.categoryId));
  }
  if (query.partnerId !== undefined) {
    searchParams.set('partnerId', String(query.partnerId));
  }
  if (query.search !== undefined && query.search.length > 0) {
    searchParams.set('search', query.search);
  }
  if (query.limit !== undefined) {
    searchParams.set('limit', String(query.limit));
  }
  if (query.offset !== undefined) {
    searchParams.set('offset', String(query.offset));
  }
  const serialized = searchParams.toString();
  return serialized.length > 0 ? `${PRODUCTS_PATH}?${serialized}` : PRODUCTS_PATH;
}

export async function getPublicProducts(
  query: GetPublicProductsQuery = {},
): Promise<GetProductsResponseDto> {
  return requestApi<GetProductsResponseDto>({
    path: createProductsPath(query),
    method: 'GET',
  });
}

export async function getPublicProductById(productId: number): Promise<ProductResponseDto> {
  return requestApi<ProductResponseDto>({
    path: `${PRODUCTS_PATH}/${productId}`,
    method: 'GET',
  });
}
