import { HttpException, HttpStatus } from '@nestjs/common';

import { AppException } from '@/common/exceptions/app.exception';
import { mapPrismaException } from '@/common/filter/exception_mappers/prisma-exception-handler';
import { mapSchemaException } from '@/common/filter/exception_mappers/schema-exception-handler';
import { fromAppException } from '@/common/filter/exception_return_handler/from-app-exception';
import { fromHttpException } from '@/common/filter/exception_return_handler/from-http-exception';
import { GeneralTypeException } from '@/common/filter/exception_return_handler/type/general-type.exception';

function tryMapSpecialExceptions(exception: unknown): GeneralTypeException | null {
  return mapPrismaException(exception) || mapSchemaException(exception) || null;
}

export function normalizeException(exception: unknown): GeneralTypeException {
  const mapped = tryMapSpecialExceptions(exception);
  if (mapped) {
    return mapped;
  }
  if (exception instanceof AppException) {
    return fromAppException(exception);
  }
  if (exception instanceof HttpException) {
    return fromHttpException(exception);
  }
  return new GeneralTypeException({
    message: exception instanceof Error ? exception.message : 'Unknown Error',
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    userFriendly: false,
    stack: exception instanceof Error ? exception.stack : undefined,
  });
}
