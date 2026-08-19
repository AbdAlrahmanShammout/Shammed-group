import { ArgumentsHost, Catch, ExceptionFilter, Injectable } from '@nestjs/common';

import { ValidationExceptions } from '@/common/exceptions/validation.exception';
import { GlobalExceptionFilter } from '@/common/filter/global-exception.filter';

@Catch(ValidationExceptions)
@Injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly globalExceptionFilter: GlobalExceptionFilter) {}

  catch(exception: ValidationExceptions, host: ArgumentsHost): unknown {
    return this.globalExceptionFilter.catch(exception, host);
  }
}
