import { requestApi } from '@/api/http-client';
import type {
  GetProductCategoriesResponseDto,
  GetProductsResponseDto,
  GetPublicProductsQuery,
} from '@/generated/public-product.contract';

const PRODUCTS_PATH = '/product';
const PRODUCT_CATEGORIES_PATH = '/product-category';

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

/**
 * Lists public products for the home products section filters.
 * Uses the same GET /product contract as the products page.
 */
export async function getHomeSectionProducts(
  query: GetPublicProductsQuery = {},
): Promise<GetProductsResponseDto> {
  return requestApi<GetProductsResponseDto>({
    path: createProductsPath(query),
    method: 'GET',
  });
}

/**
 * Lists public product categories for home section category tabs.
 */
export async function getHomeSectionProductCategories(): Promise<GetProductCategoriesResponseDto> {
  return requestApi<GetProductCategoriesResponseDto>({
    path: PRODUCT_CATEGORIES_PATH,
    method: 'GET',
  });
}
