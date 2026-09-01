import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export class SiteSettingsEmailsRequiredException extends AppException {
  constructor() {
    super({
      message: 'Contact information must have at least one email address',
      code: 'SITE_SETTINGS_EMAILS_REQUIRED',
      kind: ErrorKind.VALIDATION,
      userFriendly: true,
    });
  }
}
