import { ArgumentsHost } from '@nestjs/common';

import { GeneralTypeException } from '@/common/filter/exception_return_handler/type/general-type.exception';

export function handleGraphqlException(
  normalized: GeneralTypeException,
  _host: ArgumentsHost,
): GeneralTypeException {
  return normalized;
}
