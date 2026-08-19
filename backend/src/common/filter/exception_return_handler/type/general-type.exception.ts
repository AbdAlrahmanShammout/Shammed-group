import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';
import { ValidationErrorObject } from '@/common/exceptions/validation.exception';

export type GeneralTypeExceptionInput = {
  readonly message: string;
  readonly code: string;
  readonly statusCode: number;
  readonly userFriendly: boolean;
  readonly stack?: string;
  readonly validationErrorObjects?: ValidationErrorObject[];
};

export class GeneralTypeException extends AppException {
  readonly statusCode: number;
  override readonly stack?: string;
  readonly validationErrorObjects?: ValidationErrorObject[];

  constructor(data: GeneralTypeExceptionInput) {
    super({
      message: data.message,
      code: data.code,
      kind: ErrorKind.INTERNAL,
      userFriendly: data.userFriendly,
    });
    this.statusCode = data.statusCode;
    this.stack = data.stack;
    this.validationErrorObjects = data.validationErrorObjects;
  }
}
