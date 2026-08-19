import { AppException, AppExceptionInput } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export class InvalidStateException extends AppException {
  constructor(data: AppExceptionInput) {
    super({
      ...data,
      kind: ErrorKind.INVALID_STATE,
    });
  }
}
