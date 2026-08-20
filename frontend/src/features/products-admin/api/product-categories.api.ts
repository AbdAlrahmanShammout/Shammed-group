import { requestApi } from '@/api/http-client';
import type { GetProductCategoriesResponseDto } from '@/generated/admin-product-category.contract';

const ADMIN_PRODUCT_CATEGORY_PATH = '/admin/product-category';
const ADMIN_PRODUCT_CATEGORY_LIST_LIMIT = 100;

export async function getAdminProductCategoriesForSelect(): Promise<GetProductCategoriesResponseDto> {
  return requestApi<GetProductCategoriesResponseDto>({
    path: `${ADMIN_PRODUCT_CATEGORY_PATH}?limit=${ADMIN_PRODUCT_CATEGORY_LIST_LIMIT}&offset=0`,
    method: 'GET',
  });
}
