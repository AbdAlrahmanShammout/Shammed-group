import { ConflictException } from '@/common/exceptions/conflict.exception';

export class HomePageAlreadyExistsException extends ConflictException {
  constructor() {
    super({
      message: 'HomePage cannot be created. A home page record already exists.',
      code: 'HOME_PAGE_ALREADY_EXISTS',
      userFriendly: true,
    });
  }
}
