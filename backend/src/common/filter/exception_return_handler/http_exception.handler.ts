import { ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

import { ValidationErrorObject } from '@/common/exceptions/validation.exception';
import { GeneralTypeException } from '@/common/filter/exception_return_handler/type/general-type.exception';

export type HttpExceptionResponseBody = {
  message: string;
  code: string;
  statusCode: number;
  stack?: string;
  validationErrorObjects?: ValidationErrorObject[];
};

export function handleHttpException(normalized: GeneralTypeException, host: ArgumentsHost): void {
  const response = host.switchToHttp().getResponse<Response>();
  const body: HttpExceptionResponseBody = {
    message: normalized.message,
    code: normalized.code,
    statusCode: normalized.statusCode,
  };
  if (normalized.stack) {
    body.stack = normalized.stack;
  }
  if (normalized.validationErrorObjects) {
    body.validationErrorObjects = normalized.validationErrorObjects;
  }
  response.status(normalized.statusCode).json(body);
}
