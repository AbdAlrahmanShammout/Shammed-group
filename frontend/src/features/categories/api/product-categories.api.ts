import { requestApi } from '@/api/http-client';
import type {
  CreateProductCategoryRequestDto,
  DeleteProductCategoryResponseDto,
  GetProductCategoriesResponseDto,
  ProductCategoryResponseDto,
  UpdateProductCategoryRequestDto,
} from '@/generated/admin-product-category.contract';

const ADMIN_PRODUCT_CATEGORY_PATH = '/admin/product-category';
const ADMIN_PRODUCT_CATEGORY_LIST_LIMIT = 100;

export async function getAdminProductCategories(): Promise<GetProductCategoriesResponseDto> {
  return requestApi<GetProductCategoriesResponseDto>({
    path: `${ADMIN_PRODUCT_CATEGORY_PATH}?limit=${ADMIN_PRODUCT_CATEGORY_LIST_LIMIT}&offset=0`,
    method: 'GET',
  });
}

export async function createAdminProductCategory(
  input: CreateProductCategoryRequestDto,
): Promise<ProductCategoryResponseDto> {
  return requestApi<ProductCategoryResponseDto>({
    path: ADMIN_PRODUCT_CATEGORY_PATH,
    method: 'POST',
    body: input,
  });
}

export async function updateAdminProductCategory(input: {
  readonly categoryId: number;
  readonly body: UpdateProductCategoryRequestDto;
}): Promise<ProductCategoryResponseDto> {
  return requestApi<ProductCategoryResponseDto>({
    path: `${ADMIN_PRODUCT_CATEGORY_PATH}/${input.categoryId}`,
    method: 'PATCH',
    body: input.body,
  });
}

export async function deleteAdminProductCategory(input: {
  readonly categoryId: number;
  readonly replacementCategoryId?: number;
}): Promise<DeleteProductCategoryResponseDto> {
  const query =
    input.replacementCategoryId === undefined
      ? ''
      : `?replacementCategoryId=${input.replacementCategoryId}`;
  return requestApi<DeleteProductCategoryResponseDto>({
    path: `${ADMIN_PRODUCT_CATEGORY_PATH}/${input.categoryId}${query}`,
    method: 'DELETE',
  });
}
