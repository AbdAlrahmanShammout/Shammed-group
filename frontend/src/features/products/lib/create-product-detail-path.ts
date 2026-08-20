import { appPaths } from '@/config/app-paths';

export function createProductDetailPath(productId: number): string {
  return `${appPaths.products}/${productId}`;
}
