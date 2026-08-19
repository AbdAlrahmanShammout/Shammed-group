import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';

export class ProductCategoryLastOccupiedException extends InvalidStateException {
  constructor() {
    super({
      message:
        'ProductCategory cannot be deleted. Current status: only category with products. Expected status: another category available to receive products.',
      code: 'PRODUCT_CATEGORY_LAST_OCCUPIED',
      userFriendly: true,
    });
  }
}
