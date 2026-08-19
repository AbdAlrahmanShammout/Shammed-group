import { AppException, AppExceptionInput } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export class ConflictException extends AppException {
  constructor(data: AppExceptionInput) {
    super({
      ...data,
      kind: ErrorKind.CONFLICT,
    });
  }
}
