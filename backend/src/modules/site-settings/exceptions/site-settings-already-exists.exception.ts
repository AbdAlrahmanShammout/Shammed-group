import { ConflictException } from '@/common/exceptions/conflict.exception';

export class SiteSettingsAlreadyExistsException extends ConflictException {
  constructor() {
    super({
      message: 'SiteSettings cannot be created. A settings record already exists.',
      code: 'SITE_SETTINGS_ALREADY_EXISTS',
      userFriendly: true,
    });
  }
}
