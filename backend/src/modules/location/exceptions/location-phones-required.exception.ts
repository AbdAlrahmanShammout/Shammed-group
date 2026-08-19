import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export class LocationPhonesRequiredException extends AppException {
  constructor() {
    super({
      message: 'A location must have at least one phone number',
      code: 'LOCATION_PHONES_REQUIRED',
      kind: ErrorKind.VALIDATION,
      userFriendly: true,
    });
  }
}
