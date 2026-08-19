import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export class UnauthenticatedException extends AppException {
  constructor(message = 'Authentication required') {
    super({
      message,
      code: 'UNAUTHENTICATED',
      kind: ErrorKind.UNAUTHENTICATED,
      userFriendly: true,
    });
  }
}
