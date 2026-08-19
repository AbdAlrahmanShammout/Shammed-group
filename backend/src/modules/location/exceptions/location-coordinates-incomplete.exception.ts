import { AppException } from '@/common/exceptions/app.exception';
import { ErrorKind } from '@/common/exceptions/error-kind.enum';

export class LocationCoordinatesIncompleteException extends AppException {
  constructor() {
    super({
      message: 'Latitude and longitude must both be provided or both omitted',
      code: 'LOCATION_COORDINATES_INCOMPLETE',
      kind: ErrorKind.VALIDATION,
      userFriendly: true,
    });
  }
}
