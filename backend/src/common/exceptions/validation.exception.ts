import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export type ValidationErrorObject = {
  readonly property: string;
  readonly constraints: Record<string, string>;
};

export type ValidationExceptionsInput = {
  readonly message: string;
  readonly code: string;
  readonly kind: ErrorKind;
  readonly validationErrorObjects: ValidationErrorObject[];
};

export class ValidationExceptions extends AppException {
  readonly validationErrorObjects: ValidationErrorObject[];

  constructor(data: ValidationExceptionsInput) {
    super({
      message: data.message,
      code: data.code,
      kind: data.kind,
      userFriendly: true,
    });
    this.validationErrorObjects = data.validationErrorObjects;
  }
}
