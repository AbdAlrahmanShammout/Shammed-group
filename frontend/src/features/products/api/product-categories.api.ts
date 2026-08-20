import { requestApi } from '@/api/http-client';
import type { GetProductCategoriesResponseDto } from '@/generated/public-product.contract';

const PRODUCT_CATEGORIES_PATH = '/product-category';

export async function getPublicProductCategories(): Promise<GetProductCategoriesResponseDto> {
  return requestApi<GetProductCategoriesResponseDto>({
    path: PRODUCT_CATEGORIES_PATH,
    method: 'GET',
  });
}
