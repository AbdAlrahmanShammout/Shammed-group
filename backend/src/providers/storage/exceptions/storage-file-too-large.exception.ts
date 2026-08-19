import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export class StorageFileTooLargeException extends AppException {
  constructor(maxFileBytes: number) {
    super({
      message: `The file exceeds the maximum size of ${maxFileBytes} bytes`,
      code: 'STORAGE_FILE_TOO_LARGE',
      kind: ErrorKind.VALIDATION,
      userFriendly: true,
    });
  }
}
