import { requestApi } from '@/api/http-client';
import type {
  CreateProductRequestDto,
  DeleteProductResponseDto,
  GetProductsResponseDto,
  ProductResponseDto,
  UpdateProductRequestDto,
} from '@/generated/admin-product.contract';

const ADMIN_PRODUCT_PATH = '/admin/product';
const ADMIN_PRODUCT_LIST_LIMIT = 100;

export async function getAdminProducts(): Promise<GetProductsResponseDto> {
  return requestApi<GetProductsResponseDto>({
    path: `${ADMIN_PRODUCT_PATH}?limit=${ADMIN_PRODUCT_LIST_LIMIT}&offset=0`,
    method: 'GET',
  });
}

export async function createAdminProduct(
  input: CreateProductRequestDto,
): Promise<ProductResponseDto> {
  return requestApi<ProductResponseDto>({
    path: ADMIN_PRODUCT_PATH,
    method: 'POST',
    body: input,
  });
}

export async function updateAdminProduct(input: {
  readonly productId: number;
  readonly body: UpdateProductRequestDto;
}): Promise<ProductResponseDto> {
  return requestApi<ProductResponseDto>({
    path: `${ADMIN_PRODUCT_PATH}/${input.productId}`,
    method: 'PATCH',
    body: input.body,
  });
}

export async function deleteAdminProduct(productId: number): Promise<DeleteProductResponseDto> {
  return requestApi<DeleteProductResponseDto>({
    path: `${ADMIN_PRODUCT_PATH}/${productId}`,
    method: 'DELETE',
  });
}
