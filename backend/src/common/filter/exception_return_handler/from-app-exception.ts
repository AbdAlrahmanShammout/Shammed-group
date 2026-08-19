import { HttpStatus } from '@nestjs/common';

import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';
import { ValidationExceptions } from '@/common/exceptions/validation.exception';
import { GeneralTypeException } from '@/common/filter/exception_return_handler/type/general-type.exception';

const KIND_TO_STATUS: Record<ErrorKind, HttpStatus> = {
  [ErrorKind.VALIDATION]: HttpStatus.UNPROCESSABLE_ENTITY,
  [ErrorKind.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorKind.CONFLICT]: HttpStatus.CONFLICT,
  [ErrorKind.INVALID_STATE]: HttpStatus.BAD_REQUEST,
  [ErrorKind.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
  [ErrorKind.ACCESS_DENIED]: HttpStatus.FORBIDDEN,
  [ErrorKind.DEPENDENCY_FAILURE]: HttpStatus.SERVICE_UNAVAILABLE,
  [ErrorKind.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
};

export function fromAppException(exception: AppException): GeneralTypeException {
  return new GeneralTypeException({
    message: exception.message,
    code: exception.code,
    statusCode: KIND_TO_STATUS[exception.kind],
    userFriendly: exception.userFriendly,
    stack: exception.stack,
    validationErrorObjects:
      exception instanceof ValidationExceptions ? exception.validationErrorObjects : undefined,
  });
}
