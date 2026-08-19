import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export class MediaFileRequiredException extends AppException {
  constructor() {
    super({
      message: 'An image file is required',
      code: 'MEDIA_FILE_REQUIRED',
      kind: ErrorKind.VALIDATION,
      userFriendly: true,
    });
  }
}
