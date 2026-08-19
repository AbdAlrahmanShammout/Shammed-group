import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export class AccessDeniedException extends AppException {
  constructor() {
    super({
      message: 'Access denied',
      code: 'ACCESS_DENIED',
      kind: ErrorKind.ACCESS_DENIED,
      userFriendly: true,
    });
  }
}
