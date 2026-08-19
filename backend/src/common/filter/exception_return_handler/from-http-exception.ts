import { HttpException, HttpStatus } from '@nestjs/common';

import { GeneralTypeException } from '@/common/filter/exception_return_handler/type/general-type.exception';

export function fromHttpException(exception: HttpException): GeneralTypeException {
  const statusCode = exception.getStatus();
  const response = exception.getResponse();
  const message =
    typeof response === 'string'
      ? response
      : typeof response === 'object' && response !== null && 'message' in response
        ? String((response as { message: unknown }).message)
        : exception.message;
  return new GeneralTypeException({
    message,
    code: 'HTTP_EXCEPTION',
    statusCode,
    userFriendly: statusCode < HttpStatus.INTERNAL_SERVER_ERROR,
    stack: exception.stack,
  });
}
