import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export class StorageInvalidTypeException extends AppException {
  constructor() {
    super({
      message: 'Only JPG, PNG, and WebP images are allowed',
      code: 'STORAGE_INVALID_TYPE',
      kind: ErrorKind.VALIDATION,
      userFriendly: true,
    });
  }
}
