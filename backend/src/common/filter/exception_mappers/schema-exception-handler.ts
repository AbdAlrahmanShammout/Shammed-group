import { HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';

import { GeneralTypeException } from '@/common/filter/exception_return_handler/type/general-type.exception';

export function mapSchemaException(exception: unknown): GeneralTypeException | null {
  if (!(exception instanceof ZodError)) {
    return null;
  }
  return new GeneralTypeException({
    message: 'Invalid input',
    code: 'BAD_USER_INPUT',
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    userFriendly: true,
    stack: exception.stack,
    validationErrorObjects: exception.issues.map((issue) => ({
      property: issue.path.join('.'),
      constraints: { [issue.code]: issue.message },
    })),
  });
}
