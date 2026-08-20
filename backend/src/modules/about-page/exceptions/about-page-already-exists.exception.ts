import { ConflictException } from '@/common/exceptions/conflict.exception';

export class AboutPageAlreadyExistsException extends ConflictException {
  constructor() {
    super({
      message: 'AboutPage cannot be created. An about page record already exists.',
      code: 'ABOUT_PAGE_ALREADY_EXISTS',
      userFriendly: true,
    });
  }
}
