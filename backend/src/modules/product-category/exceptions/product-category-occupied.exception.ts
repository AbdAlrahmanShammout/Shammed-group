import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';

export class ProductCategoryOccupiedException extends InvalidStateException {
  constructor() {
    super({
      message:
        'ProductCategory cannot be deleted. Current status: contains products. Expected status: empty, or a replacement category.',
      code: 'PRODUCT_CATEGORY_OCCUPIED',
      userFriendly: true,
    });
  }
}
