import { AppException, AppExceptionInput } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export class DependencyFailureException extends AppException {
  constructor(data: AppExceptionInput) {
    super({
      ...data,
      kind: ErrorKind.DEPENDENCY_FAILURE,
    });
  }
}
