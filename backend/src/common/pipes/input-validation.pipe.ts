import { Injectable, ValidationError, ValidationPipe } from '@nestjs/common';

import { ErrorKind } from '@/common/exceptions/error-kind.enum';
import {
  ValidationErrorObject,
  ValidationExceptions,
} from '@/common/exceptions/validation.exception';

@Injectable()
export class InputValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors: ValidationError[]) =>
        new ValidationExceptions({
          message: 'Invalid input',
          code: 'BAD_USER_INPUT',
          kind: ErrorKind.VALIDATION,
          validationErrorObjects: InputValidationPipe.getFactoryErrors(validationErrors),
        }),
    });
  }

  static getFactoryErrors(
    validationErrors: ValidationError[],
    parentProperty = '',
  ): ValidationErrorObject[] {
    return validationErrors.flatMap((error) => {
      const property = `${parentProperty}${error.property}`;
      const current: ValidationErrorObject[] = error.constraints
        ? [{ property, constraints: error.constraints }]
        : [];
      const children = error.children?.length
        ? InputValidationPipe.getFactoryErrors(error.children, `${property}.`)
        : [];
      return [...current, ...children];
    });
  }
}
