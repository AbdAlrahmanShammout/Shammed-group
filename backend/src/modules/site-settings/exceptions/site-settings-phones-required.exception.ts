import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export class SiteSettingsPhonesRequiredException extends AppException {
  constructor() {
    super({
      message: 'Contact information must have at least one phone number',
      code: 'SITE_SETTINGS_PHONES_REQUIRED',
      kind: ErrorKind.VALIDATION,
      userFriendly: true,
    });
  }
}
