import { requestApi } from '@/api/http-client';
import type {
  GetPublicProductsQuery,
  GetProductsResponseDto,
} from '@/generated/public-product.contract';

const PRODUCTS_PATH = '/product';

function createProductsPath(query: GetPublicProductsQuery = {}): string {
  const searchParams = new URLSearchParams();
  if (query.categoryId !== undefined) {
    searchParams.set('categoryId', String(query.categoryId));
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
